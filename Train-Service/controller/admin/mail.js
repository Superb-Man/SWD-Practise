const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
pass = process.env.password;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kazitoriqe207@gmail.com',
        pass: pass// Use an "App Password" if you have 2-Step Verification enabled
    },
});


async function mailing(toWhom,subject,text) {
    try{
        const mailOptions = {
            from: 'kazitoriqe207@gmail.com',
            to: toWhom,
            subject: subject,
            text: text ,
        };
        let info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${info.messageId}`);
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    mailing,
}