const express = require('express');
const SSLCommerzPayment = require("sslcommerz");
const airPool = require('../config/airDB');
const paymentPool = require('../config/paymentDB');
const accountPool = require('../config/accountDB');
const nodemailer = require('nodemailer');     // send the ticket in mail
const config  = require('../config.json')

const { Pool } = require('pg');

const { PDFDocument , StandardFonts , rgb } = require('pdf-lib')
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const mainUrl = process.env.ROOT

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASSWORD
const is_live = false //true for live, false for 

const transporter = nodemailer.createTransport({
  service : 'gmail',
  auth : {
      user: config.email,
      pass: config.password
  }
});



const paymentInitAir = async (req, res) => {

  const { user_name, accesstoken, seat_booked, air_schedule_id, grandTotalFare, class_name , seat_booked_string,  transportType , source , destination} = req.body;
  // console.log(ticketInfo);
  console.log(user_name);
  console.log(accesstoken);
  console.log(seat_booked);
  console.log(air_schedule_id);
  console.log(grandTotalFare);
  console.log(class_name);
  console.log(seat_booked_string);
  console.log(transportType);
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
  let airScheduleIds = "";
  let successUrl = "";

  //  create successUrl [air]
  successUrl = `${mainUrl}/successAir`;

  const data = {
    total_amount: grandTotalFare,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: successUrl,
    fail_url: `${mainUrl}/fail`,
    cancel_url: `${mainUrl}/paymentCancel`,
    ipn_url: `${mainUrl}/paymentIpn`,
    shipping_method: 'No',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'cust@yahoo.com',
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
    // console.log(apiResponse?.GatewayPageURL)
    // if (data?.GatewayPageURL) {
    //   return res.status(200).redirect(data?.GatewayPageURL);
    // }
    // else {
    //   return res.status(400).json({
    //     message: "Session was not successful"
    //   });
    // }
    // const ticket_id = 21;
    
    const details = {
        "source" : source,
        "destination" : destination,
        "date" : date,
        "time" : time,
    }

    try {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      console.log('Redirecting to: ', apiResponse.GatewayPageURL);
      console.log(data);

      // console.log(req.body)
    
      const getTicketInfoQuery = {
        text: `INSERT into "info" (schedule_id, username, seat_booked, seat_booked_string, class_name,transaction_id, paid_status, details , amount ) VALUES ($1, $2, $3, $4, $5 , $6, $7 , $8, $9) RETURNING *`,
        values: [ air_schedule_id, user_name, seat_booked , seat_booked_string, class_name , transactionId, 'false', details , grandTotalFare]
      }
      const result = await airPool.query(getTicketInfoQuery);
      console.log(result);

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

const paymentSuccessAir =  async (req, res) => {

  /** 
  * If payment successful 
  */

  console.log("Success API ")
  // console.log("transaction ID  = " , req.params.tran_id);

  airPool.query('BEGIN');
  const data = req.body;
  // const { air_schedule_id  } = req.body;
  console.log(req.body);  
  const ssl = new SSLCommerzPayment(store_id, store_passwd, is_live)
  const validation = ssl.validate(data);
  validation.then(validation => {
      console.log('Validation success');
      // console.log(validation);
  }).catch(error => {
      console.log(error);
  }); 

  const transactionId = data.tran_id;
  const paymentMedium = data.card_issuer;
  // const airScheduleIdArray = airScheduleIds.split('_');
  // const ticketIdArray = ticketIds.split('_');
  console.log("ei line " , transactionId, paymentMedium)
  try{
      const updatePaidStatus = {
          text: `UPDATE "info" SET paid_status = $1 WHERE transaction_id = $2`,
          values: ['true', transactionId]
      }
      const result = await airPool.query(updatePaidStatus);
      console.log(result);
      // success work done here

      // create a new ticket
      // const transactionId = req.body.transactionId; 
        const getTicketInfo = {
            text: `SELECT * FROM "info" WHERE transaction_id = $1`,
            values: [transactionId]
        };
        const result2 = await airPool.query(getTicketInfo);
        const ticketInfo = result2.rows[0];

        // Retrieve client information
        const username = ticketInfo.username;
        const getUserEmailQuery = {
            text: `SELECT * FROM "clients" WHERE username = $1`,
            values: [username]
        };
        const result3 = await accountPool.query(getUserEmailQuery);
        const clientInfo = result3.rows[0];

        // Retrieve air schedule information
        const schedule_id = ticketInfo.schedule_id;

        const getAirScheduleInfoQuery = {
            text: `SELECT * FROM "air_schedule_info" WHERE schedule_id = $1`,
            values: [schedule_id]
        };
        const result4 = await airPool.query(getAirScheduleInfoQuery);
        const airScheduleInfo = result4.rows[0];

        // Retrieve air services information
        const air_id = airScheduleInfo.air_id;
        const getAirServicesQuery = {
            text: `SELECT * FROM "air_services" WHERE air_id = $1`,
            values: [air_id]
        };
        const result5 = await airPool.query(getAirServicesQuery);
        const airServices = result5.rows[0];

        // Create a new PDF document
        const doc = await PDFDocument.create();
        const page = doc.addPage();
        const { width, height } = page.getSize();

        // Set font sizes
        const titleFontSize = 25;
        const subtitleFontSize = 12;
        const textFontSize = 10;

        // Add title
        page.drawText("e-TravelKit Ticket", {
            x: 50,
            y: height - 4 * titleFontSize,
            size: titleFontSize,
            font: await doc.embedFont(StandardFonts.TimesRoman),
            color: rgb(1.0, 0.8, 0)
        });
        // Draw client information
        let startY = height - 150;
        page.drawText(`Name : ${clientInfo.name}`, {
            x: 50,
            y: startY,
            size: subtitleFontSize,
            font: await doc.embedFont(StandardFonts.TimesRomanBold),
            color: rgb(0.2, 0.2, 0.2)
        });

        startY -= 20;
        page.drawText(`Email  : ${clientInfo.email}`, {
            x: 50,
            y: startY,
            size: subtitleFontSize,
            font: await doc.embedFont(StandardFonts.TimesRoman),
            color: rgb(0.2, 0.2, 0.2)
        });

        startY -= 20;
        page.drawText(`Phone  : ${clientInfo.phone}`, {
            x: 50,
            y: startY,
            size: subtitleFontSize,
            font: await doc.embedFont(StandardFonts.TimesRoman),
            color: rgb(0.2, 0.2, 0.2)
        });

        // Extract the client's date of birth
        const clientDOB = new Date(clientInfo.date_of_birth);

        // Format the date to "12 DEC 1998" format
        const formattedDOB = `${clientDOB.getDate()} ${clientDOB.toLocaleString('default', { month: 'short' })} ${clientDOB.getFullYear()}`;
        
        
        const today = new Date();
        let age = today.getFullYear() - clientDOB.getFullYear();
        const monthDiff = today.getMonth() - clientDOB.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < clientDOB.getDate())) {
            age--;
        }

        startY -= 20;
        page.drawText(`Age  : ${age} years`, {
            x: 50,
            y: startY,
            size: subtitleFontSize,
            font: await doc.embedFont(StandardFonts.TimesRoman),
            color: rgb(0.2, 0.2, 0.2)
        });

        // Draw a horizontal line
        const lineY = startY - 20;
        page.drawLine({
            start: { x: 50, y: lineY },
            end: { x: width - 50, y: lineY },
            color: rgb(0.3, 0.5, 1.0),
            thickness: 1
        });

        // Flight Details
        startY -= 40;
        page.drawText(`Flight Details :`, {
            x: 50,
            y: startY,
            size: subtitleFontSize,
            font: await doc.embedFont(StandardFonts.TimesRomanBold),
            color: rgb(0.2, 0.2, 0.2)
        });

        // Draw company information
        const companyY = lineY - 40;
        page.drawText(`Company Name: ${airServices.company_name}`, {
            x: 50,
            y: companyY,
            size: subtitleFontSize,
            font: await doc.embedFont(StandardFonts.Helvetica),
            color: rgb(0.2, 0.2, 0.2)
        });

// Draw departure and arrival information
      // Departure Date
      startY = companyY - 30;
      page.drawText(`From:`, {
          x: 50,
          y: startY,
          size: subtitleFontSize,
          font: await doc.embedFont(StandardFonts.Helvetica),
          color: rgb(0.2, 0.2, 0.2)
      });
      page.drawText(`${airScheduleInfo.from_port}`, {
          x: 150,
          y: startY,
          size: subtitleFontSize,
          font: await doc.embedFont(StandardFonts.Helvetica),
          color: rgb(0.2, 0.2, 0.2)
      });

      // To Location
      page.drawText(`To:`, {
        x: 300, // Adjust as needed
        y: startY, // Same startY as Departure Date
        size: subtitleFontSize,
        font: await doc.embedFont(StandardFonts.Helvetica),
        color: rgb(0.2, 0.2, 0.2)
      });
      page.drawText(`${airScheduleInfo.to_port}`, {
        x: 400, // Adjust as needed
        y: startY, // Same startY as Departure Date
        size: subtitleFontSize,
        font: await doc.embedFont(StandardFonts.Helvetica),
        color: rgb(0.2, 0.2, 0.2)
      });
      
      startY -= 20;
      page.drawText(`Departure Date:`, {
          x: 50,
          y: startY,
          size: subtitleFontSize,
          font: await doc.embedFont(StandardFonts.Helvetica),
          color: rgb(0.2, 0.2, 0.2)
      });
      // Extract the departure date components
      const departureDate = new Date(airScheduleInfo.departure_date);
      const day = departureDate.getDate();
      const month = departureDate.toLocaleString('default', { month: 'short' });
      const year = departureDate.getFullYear();

      // Format the departure date
      const formattedDepartureDate = `${day} ${month} ${year}`;
      page.drawText(`${formattedDepartureDate}`, {
          x: 150,
          y: startY,
          size: subtitleFontSize,
          font: await doc.embedFont(StandardFonts.Helvetica),
          color: rgb(0.2, 0.2, 0.2)
      });

      // Arrival Date
      page.drawText(`Arrival Date:`, {
        x: 300, // Adjust as needed
        y: startY,
        size: subtitleFontSize,
        font: await doc.embedFont(StandardFonts.Helvetica),
        color: rgb(0.2, 0.2, 0.2)
      });
      const arrivalDate = new Date(airScheduleInfo.arrival_date);
      const arrivalDay = arrivalDate.getDate();
      const arrivalMonth = arrivalDate.toLocaleString('default', { month: 'short' });
      const arrivalYear = arrivalDate.getFullYear();
      const formattedArrivalDate = `${arrivalDay} ${arrivalMonth} ${arrivalYear}`;
      page.drawText(`${formattedArrivalDate}`, {
        x: 400, // Adjust as needed
        y: startY,
        size: subtitleFontSize,
        font: await doc.embedFont(StandardFonts.Helvetica),
        color: rgb(0.2, 0.2, 0.2)
      });

      // Departure Time (Assuming departureTime variable is defined)
      startY -= 20;
      page.drawText(`Departure Time:`, {
          x: 50,
          y: startY,
          size: subtitleFontSize,
          font: await doc.embedFont(StandardFonts.Helvetica),
          color: rgb(0.2, 0.2, 0.2)
      });
      page.drawText(`${airScheduleInfo.departure_time}`, {
          x: 150,
          y: startY,
          size: subtitleFontSize,
          font: await doc.embedFont(StandardFonts.Helvetica),
          color: rgb(0.2, 0.2, 0.2)
      });

      // Arrival Time
      page.drawText(`Arrival Time:`, {
        x: 300, // Adjust as needed
        y: startY,
        size: subtitleFontSize,
        font: await doc.embedFont(StandardFonts.Helvetica),
        color: rgb(0.2, 0.2, 0.2)
      });
      page.drawText(`${airScheduleInfo.arrival_time}`, {
        x: 400, // Adjust as needed
        y: startY,
        size: subtitleFontSize,
        font: await doc.embedFont(StandardFonts.Helvetica),
        color: rgb(0.2, 0.2, 0.2)
      });

      startY -= 20;
      page.drawLine({
          start: { x: 50, y: startY },
          end: { x: width - 50, y: startY },
          color: rgb(0.3, 0.5, 1.0),
          thickness: 1
      });
      
// Draw Seat Booked String
startY -= 40; 
page.drawText(`Seat Booked : ${ticketInfo.seat_booked_string}`, {
    x: 50,
    y: startY,
    size: subtitleFontSize,
    font: await doc.embedFont(StandardFonts.TimesRoman),
    color: rgb(0.2, 0.2, 0.2)
});

// Draw Total Fare
page.drawText(`Total Fare: Tk ${ticketInfo.amount}`, {
    x: 450,
    y: startY,
    size: subtitleFontSize,
    font: await doc.embedFont(StandardFonts.TimesRomanBold),
    color: rgb(0.2, 0.2, 0.2)
});


  // Save the PDF
  const filePath = "./ticket#"+`${transactionId}`+".pdf";
  fs.writeFileSync(filePath, await doc.save());

  // Create a Nodemailer transporter

// Compose an email
    transporter.sendMail({
      from : 'Tarik <'+config.email+'>',
      to : 'shafiulhaque982@gmail.com',
      subject: "Place Order",
      html: `<h1> Heading </h1>
          <p> This is nodemailer </p>`,
      attachments:[
          {
              filename:'Air_Ticket'+`${transactionId}`+".pdf", 
              path:filePath
          }
      ]
    },(err,info) => {
      if(err) throw err;

      res.json({status:info.response})
    })
      


  } catch {

    }




  // airPool.query('COMMIT');
  return res.status(200).json(
    {
      status : 'success',
      data: req.body,
      message: 'Payment success'
    }
  );


} 

const ticket = async ( req , res ) => {
  

    
try {
  let transporter = nodemailer.createTransport({
    service: 'gmail', // such as 'gmail'
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
  });
  
// Compose an email
let mailOptions = {
  from: "Shafi <" + process.env.EMAIL + ">" ,
  to: '1905119@ugrad.cse.ac.bd',
  subject: 'Sending a PDF Attachment',
  text: 'Please find the attached PDF file.',
  attachments: [
      {
          filename: 'your_ticket.pdf',
          path: 'ticket0.pdf' // Path to your PDF file
      }
  ]
};
console.log("mailOp")
// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.log('Error occurred:', error);
  } else {
      console.log('Email sent:', info.response);
  }
});

    } catch {
      console.log("error in nodemail test")
    }


  // ticket print pdf
  
       
  

  // airPool.query('COMMIT');
  return res.status(200).json(
    {
      status : 'success',
      data: req.body,
      message: 'Payment success'
    }
  );
}


const paymentFail = async (req, res) => {

  /** 
  * If payment failed 
  */
  console.log("Failed API ")
  console.log(req.body);

  const data = req.body;
  const transactionId = data.tran_id;

  try{


    // const selectquery = {

    //   text: SELECT * FROM "info" WHERE transaction_id = $1,
    //   values: [ transactionId]

    // }
    // const selresult = await airPool.query(selectquery).rows[0];

    // console.log(selresult)

    // // const checkQuery ={
    // //   text : 'SELECT * from "air_schedule_info" WHERE schedule_id = $1 and cancel_deadline >= $2',
    // //   values : [selresult.schedule_id,new Date()]
    // // }

    // // const check = (await airPool.query(checkQuery)).rows[0] ;

    // const query3 = {
    //   text : 'SELECT class_id FROM "class_info" WHERE class_name = $1',
    //   values : [selresult.class_name]
    // }

    // let class_id = (await airPool.query(query3)).rows[0].class_id;
    // //console.log(dimensions)
    

    // const dimension_query = {
    //   text : 'SELECT "air_details".dimensions,"air_details".classes FROM "air_details" JOIN "air_schedule_info" ON "air_schedule_info".flight_id = "air_details".flight_id  WHERE schedule_id = $1',
    //   values : [selresult.schedule_id]
    // }

    // let {dimensions,classes} = (await airPool.query(dimension_query)).rows[0] ;

    // console.log(dimensions)

    // for(let i = 0 ; i < selresult.seat_booked.length ; i++) {
    //   //update two columns
    //   const query2 = {
    //       text : 'UPDATE "air_schedule_info" SET seat_details[$1][$2][$3] = $4 WHERE schedule_id = $5',
    //       values : [class_id,dimensions[class_id][1]*data.seat_booked[i][0]+data.seat_booked[i][1]+1,2,0,selresult.schedule_id]
    //   }
    //   await airPool.query(query2) ;
    // }

    //console.log(selresult)

    const deletequery = {
        text: `DELETE from "info" WHERE transaction_id = $1`,
        values: [ transactionId]
    }
  const result = await airPool.query(deletequery);
  console.log(result);

} catch {

}

  return res.status(200).json(
    {
      data: req.body,
      message: 'Payment failed'
    }
  );
}


module.exports = {
  paymentInitAir,
  paymentSuccessAir,
  paymentFail,
  ticket

}