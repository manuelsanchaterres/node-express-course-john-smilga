const sendEmail = require('./sendEmail');

const sendVerificationEmail = async({name, token, email, origin}) => {

    const verifyEmailLink = `${origin}/user/verify-email/?token=${token}&email=${email}`

    const message = `<p>Confirm your email clicking on <a href="${verifyEmailLink}">verify email</a></p>`
    return sendEmail({to:email, subject: 'Email Confirmation', html: `<h4>Hello, ${name}</h4>
    ${message}`})

}

module.exports = sendVerificationEmail
