const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const sendEmail = async({to, subject, html}) => {
    
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailerConfig({host: 'smtp.ethereal.email', port: 587, user: 'magdalena14@ethereal.email', pass: '96dqsgAA4d4VX3Kzus'});

    return transporter.sendMail({

        from:'"Manudev Junior Candidate Full Stack Developer" <testmanudev@gmail.com>',
        to,
        subject,
        html

    })

}

module.exports = sendEmail
