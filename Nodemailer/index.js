const express = require('express')
const app = express();
const nodemailer = require('nodemailer')
const config  = require('./config.json')


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user: config.email,
        pass: config.password
    }
});


app.get('/' , (req,res) => {

    transporter.sendMail({
        from : 'Tarik <'+config.email+'>',
        to : 'exampleuser@yopmail.com',
        subject: "Place Order",
        html: `<h1> Heading </h1>
            <p> This is nodemailer </p>`,
        attachments:[
            {
                filename:'Usr_Ticket.pdf',
                path:'ticket.pdf'
            }
        ]
    },(err,info) => {
        if(err) throw err;

        res.json({status:info.response})
    })

})


app.listen(7000 , ()=> console.log('Running on 7000'))