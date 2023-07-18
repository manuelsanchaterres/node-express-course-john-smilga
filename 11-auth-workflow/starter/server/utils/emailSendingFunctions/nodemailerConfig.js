const nodemailer = require('nodemailer')

const nodemailerConfig = ({host, port, user, pass}) => {

    const transporter = nodemailer.createTransport({

        host,
        port,
        auth: {
            user,
            pass
        },
        // add only in development
        tls: {
            rejectUnauthorized: false
        }        
        
    })
    
    return transporter

}

module.exports = nodemailerConfig