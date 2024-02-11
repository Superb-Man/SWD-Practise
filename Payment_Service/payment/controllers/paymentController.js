const SSLCommerzPayment = require("sslcommerz").SslCommerzPayment;
const dotenv = require('dotenv');
// const busPool = require('../config/busDB');
// const trainPool = require('../config/trainDB');
// const accountPool = require('../config/accountDB');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const nodemailer = require('nodemailer');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs').promises;
const path = require('path');
const { propfind } = require("../routes/routes");

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASEAPIKEY,
    authDomain: process.env.FIREBASEAUTHDOMAIN,
    projectId: process.env.FIREBASEPROJECTID,
    storageBucket: process.env.FIREBASESTORAGEBUCKET,
    messagingSenderId: process.env.FIREBASEMESSAGINGSENDERID,
    appId: process.env.FIREBASEAPPID,
    measurementId: process.env.FIREBASEMEASUREMENTID
};
// const firebaseConfig = {
//     apiKey: "AIzaSyDan4RY6-KwXeGq0WybYmQxIS5ucPt5lnA",
//     authDomain: "fir-1-705b1.firebaseapp.com",
//     databaseURL: "https://fir-1-705b1-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "fir-1-705b1",
//     storageBucket: "fir-1-705b1.appspot.com",
//     messagingSenderId: "574385258048",
//     appId: "1:574385258048:web:61ddf64bc1241502c969a5"
//   };

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

// 
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'xyz@gmail.com',
        pass: 'sjfkfrni', // Use an "App Password" if you have 2-Step Verification enabled
    },
});

const store_id = process.env.STOREID
const store_passwd = process.env.STOREPASSWORD
const is_live = false //true for live, false for sandbox

//sslcommerz init
const paymentInit = async (req, res) => {
    const { ticketInfo, userId, grandTotalFare, transportType } = req.body;

    // Generate unique transaction ID of 20 characters length mixed with letters and numbers
    const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Get today's date
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    // Get current time
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    // Get current date and time
    const dateTime = date + ' ' + time;
    let ticketsIds = "";
    let busScheduleIds = "";
    let trainScheduleIds = "";
    let airScheduleIds = "";
    let successUrl = "";

    if (transportType === 'bus') {
        for (let i = 0; i < ticketInfo.length; i++) {
            ticketsIds += ticketInfo[i].ticketId + '_';
            busScheduleIds += ticketInfo[i].busScheduleId + '_';
        }
        successUrl = `${mainUrl}/paymentSuccess/\\${busScheduleIds}/\\${ticketsIds}`;
    } else if (transportType === 'train') {
        for (let i = 0; i < ticketInfo.length; i++) {
            ticketsIds += ticketInfo[i].ticketId + '_';
            trainScheduleIds += ticketInfo[i].trainScheduleId + '_';
        }
        successUrl = `${mainUrl}/paymentSuccessTrain/\\${trainScheduleIds}/\\${ticketsIds}`;
    } else if (transportType === 'air') {
        for (let i = 0; i < ticketInfo.length; i++) {
            ticketsIds += ticketInfo[i].ticketId + '_';
            airScheduleIds += ticketInfo[i].airScheduleId + '_';
        }
        successUrl = `${mainUrl}/paymentSuccessAir/\\${airScheduleIds}/\\${ticketsIds}`;
    }

    const data = {
        total_amount: grandTotalFare,
        currency: 'BDT',
        tran_id: transactionId, // use unique tran_id for each api call
        success_url: successUrl,
        fail_url: `${mainUrl}/paymentFail`,
        cancel_url: `${mainUrl}/cancel`,
        ipn_url: `${mainUrl}/paymentIpn`,
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'mahbubzeeon@gmail.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(async apiResponse => {
        // Redirect the user to payment gateway

        //save transaction info to database
        try {
            let GatewayPageURL = apiResponse.GatewayPageURL;
            console.log('Redirecting to: ', apiResponse.GatewayPageURL);
            return res.status(200).json({
                status: 'success',
                message: 'Payment Init',
                data: apiResponse,
                url: GatewayPageURL
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: 'fail',
                message: 'Database error',
                data: err
            });
        }
    });
}