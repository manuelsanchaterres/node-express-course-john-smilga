const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/emailSendingFunctions/sendVerificationEmail');
const Token = require('../models/Token');
const sendResetPasswordEmail = require('../utils/emailSendingFunctions/sendResetPasswordEmail');
const hashString = require('../utils/createHash');

const register = async (req, res) => {

  const { email, name, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';
  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await User.create({ name, email, password, role, verificationToken});
  const origin = process.env.LOCAL_FRONT_END_ROOT_ENDPOINT
  await sendVerificationEmail({token: user.verificationToken, email: user.email, name: user.name, origin})

  // send verification token only while working with postman
  
  // res.status(StatusCodes.CREATED).json({msg: 'Success! Please check your email to verify account', verificationToken: user.verificationToken, email: user.email});

  res.status(StatusCodes.CREATED).json({msg: 'Success! Please check your email to verify account'});

};

const verifyEmail = async (req,res) => {

  const {verificationToken, email} = req.body
  const user = await User.findOne({email})

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (user.verificationToken !== verificationToken) {

    throw new CustomError.UnauthenticatedError('Invalid Credentials');

  }

  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ''
  await user.save()

  res.status(StatusCodes.OK).json({msg: 'Email Verified'})

}

const forgotPassword = async (req,res) => {

  const {email} = req.body

  if (!email) {
    throw new CustomError.BadRequestError('Please provide valid email');
  }

  const user = await User.findOne({email})

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const passwordToken = crypto.randomBytes(40).toString('hex');
  const tenMinutes = 1000*60*10
  const passwordTokenExpirationDate = Date.now() + tenMinutes
  const origin = process.env.LOCAL_FRONT_END_ROOT_ENDPOINT

  user.passwordToken = hashString(passwordToken)

  user.passwordTokenExpirationDate = passwordTokenExpirationDate

  await user.save()

  await sendResetPasswordEmail({token: user.passwordToken, email: user.email, name: user.name, origin})

  res.status(StatusCodes.OK).json({msg: 'Success! Please check your email to Reset Password'});

}

const resetPassword = async (req,res) => {

  const {password, token, email} = req.body

  if (!token || !password || !email) {

    throw new CustomError.BadRequestError('Please provide all values');

  }
  const user = await User.findOne({email, passwordToken: token})
  const currenDate = new Date()

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (user.passwordToken !== token) {

    console.log('line 108');
    throw new CustomError.UnauthenticatedError('Invalid Credentials');

  }

  // check if the password token already expired
  
  if (user.passwordTokenExpirationDate < currenDate) {

    throw new CustomError.UnauthenticatedError('Credentials have expired, please request again for password rese');

  }

  user.password = password
  user.passwordToken = null
  user.passwordTokenExpirationDate = null
  await user.save()

  res.status(StatusCodes.OK).json({msg: 'User Password Succesfully Reset'})

}

const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (!user.isVerified) {

    throw new CustomError.UnauthenticatedError('Please verify your email')

  }

  const tokenUser = createTokenUser(user);

  // create refresh token

  let refreshToken = "";

  // check for existing token

  const existingToken = await Token.findOne({user: user._id})

  if (existingToken) {

    const {isValid} = existingToken

    if (!isValid) {

      throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }

    refreshToken = existingToken.refreshToken

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({ user: tokenUser});
    
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = {refreshToken, ip, userAgent, user: user._id}

  await Token.create(userToken)

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser});

};
const logout = async (req, res) => {

  await Token.findOneAndDelete({user:req.user.userId})

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });


  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};


module.exports = {
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  login,
  logout,
};
