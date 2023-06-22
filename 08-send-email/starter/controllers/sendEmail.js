const nodemailer = require('nodemailer')

const sendEmail = async (req,res) => {

    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'elmer.cartwright@ethereal.email',
            pass: 'm6CuHJthzmXxUE1wER'
        },
        // add only in development
        tls: {
            rejectUnauthorized: false
        }        
    });
    

 let info = await transporter.sendMail({

    from:'"Mst736 Junior Coder" <mst736@email.com>',
    to: 'bar@example.com',
    subject: 'test email nodemailer library usage',
    html: '<h2>Sending Email with Node.js</h2>'
 })

    res.json(info)
    
}

module.exports = sendEmail