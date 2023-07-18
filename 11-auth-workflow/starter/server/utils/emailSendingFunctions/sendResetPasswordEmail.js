const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async({name, token, email, origin}) => {

    const resetPasswordLink = `${origin}/user/reset-password/?token=${token}&email=${email}`

    const message = `<p>Please reset password by clicking on the following link: 
    <a href="${resetPasswordLink}">Reset Password</a> to reset password</p>`
    return sendEmail({
        to:email, 
        subject: 'Reset Password', 
        html: `<h4>Hello, ${name}</h4>
        ${message}
        `
    })

}

module.exports = sendResetPasswordEmail
