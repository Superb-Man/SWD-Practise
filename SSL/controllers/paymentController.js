const express = require('express');
const SSLCommerzPayment = require("sslcommerz");
const airPool = require('../config/airDB');
const paymentPool = require('../config/paymentDB');

const { PDFDocument , StandardFonts , rgb } = require('pdf-lib')
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const mainUrl = process.env.ROOT

async function createPdf() {
    
  //init doc 
  const doc = await PDFDocument.create()

  const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman)

  //add a page 
  const page = doc.addPage()

  const {width,height} = page.getSize()

  let fontsize = 25

  // add text to pdf 
  page.drawText("e-TravelKit" , {
      x: 50 , 
      y: height - 4 * fontsize , 
      size: fontsize ,
      font: timesRomanFont , 
      color:rgb(1.0,0.8,0)
  })

  // page.drawText("Demo ticket")
  // page.drawText(" Name CUSTOMER " , { 
  //     x: 50 ,
  //     y: height - 4 * fontsize , 
  //     size: fontsize , 
  //     font: timesRomanFont , 
  //     color:rgb(1.0,0,0)
  // })

  let startY = height - 150;
  const lineSpacing = 25;

  const textLines = [
      `Journey Date:`,
      // `${departureDate}`,
      `12/02/2024`,
      `Journey Time:`,
      // `${departureTime}`,
      `12:00 PM`,
      `Starting Location:`,
      // `${source}`,
      `Dhaka`,
      `Destination Location:`,
      // `${destination}`,
      `Chittagong`,
  ];

  let initalStart = startY;
  let ticketId = 1234567;

  page.drawText('Ticket ID: ' + ticketId, {
      x: 50,
      y: startY,
      size: 15,
      font: await doc.embedFont(StandardFonts.TimesRomanBold),
      color: rgb(0.2, 0.2, 0.2),
  });

  startY -= lineSpacing;

  let k = 0;
  for (const line of textLines) {
      page.drawText(line, {
          x: 50,
          y: startY,
          size: 10,
          font: await doc.embedFont(k % 2 === 0 ? StandardFonts.HelveticaBold : StandardFonts.Helvetica),
          color: rgb(0, 0, 0),
      });
      k++;
      startY -= 15;
  }

  startY = initalStart - lineSpacing;

  const textLines2 = [
      `Company Name:`,
      // `${busServiceName}`,
      `Green Line` , 
      `Coach:`,
      // `${coachName}`,
      `AC` ,
      `Brand Name:`,
      // `${brandName}`,
      `Scania` , 
      `Bus ID`,
      // `${uniqueBusId}`,
      `987` ,
  ];

  k = 0;
  for (const line2 of textLines2) {
      page.drawText(line2, {
          x: width - 150,
          y: startY,
          size: 10,
          font: await doc.embedFont(k % 2 === 0 ? StandardFonts.HelveticaBold : StandardFonts.Helvetica),
          color: rgb(0, 0, 0),
      });
      k += 1
      startY -= 15;
  }

  // Define colors
  const tableHeaderBackgroundColor = rgb(217 / 255, 196 / 255, 177 / 255);
  const tableBorderColor = rgb(0.7, 0.7, 0.7);

  // Define the table layout
  const tableX = 50;
  const tableY = 400;
  const rowHeight = 30;
  const colWidths = [120, 50, 50, 100, 80, 80];

  // Define the table header
  const tableHeader = ['Name', 'Age', 'Gender', 'Phone', 'Seat', 'Fare'];

  // Draw the table header with background color and border
  let currentY = tableY;
  for (let j = 0; j < tableHeader.length; j++) {
      // Draw background color rectangle for the table header cell
      page.drawRectangle({
          x: tableX + colWidths.slice(0, j).reduce((acc, width) => acc + width, 0),
          y: currentY,
          width: colWidths[j],
          height: rowHeight,
          color: tableHeaderBackgroundColor,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 2,
      });

      // Draw text for the table header cell
      page.drawText(tableHeader[j], {
          x: tableX + colWidths.slice(0, j).reduce((acc, width) => acc + width, 0) + 5, // Adjust the padding
          y: currentY + rowHeight / 2 - 6, // Center vertically
          size: 12,
          font: await doc.embedFont(StandardFonts.Helvetica),
          color: rgb(0, 0, 0),
      });
  }
  currentY -= rowHeight;

  let passengerData = []


  const name = "Shafi", age = '23', gender = 'M', phone = '123-456', seat = 'A2', fare = '500';

  const passengerRow = [name, age, gender, phone, seat, fare];
  passengerData.push(passengerRow);



  for (const rowData of passengerData) {
      for (let j = 0; j < rowData.length; j++) {
          // Draw border rectangle for the table cell
          page.drawRectangle({
              x: tableX + colWidths.slice(0, j).reduce((acc, width) => acc + width, 0),
              y: currentY,
              width: colWidths[j],
              height: rowHeight,
              borderColor: tableBorderColor,
              borderWidth: 1,
          });

          // Draw text for the table cell
          page.drawText(`${rowData[j]}`, {
              x: tableX + colWidths.slice(0, j).reduce((acc, width) => acc + width, 0) + 5, // Adjust the padding
              y: currentY + rowHeight / 2 - 6, // Center vertically
              size: 10,
              font: await doc.embedFont(StandardFonts.Helvetica),
              color: rgb(0, 0, 0),
          });
      }
      currentY -= rowHeight;
  }

  let totalFare = 500 
  // Add the total price
  // Implement this function
  page.drawText(`Total Fare: Tk ${totalFare}`, {
      x: 400,
      y: currentY - 10,
      size: 15,
      font: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
      color: rgb(0.1, 0.1, 0.1),
  });


  // save the pdf 
  fs.writeFileSync("./ticket.pdf" , await doc.save())


}

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASSWORD
const is_live = false //true for live, false for sandbox


const paymentInit = async (req, res) => {

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
  let busScheduleIds = "";
  let trainScheduleIds = "";
  let airScheduleIds = "";
  let successUrl = "";

    // if (transportType === 'bus') {
    //     // for (let i = 0; i < ticketInfo.length; i++) {
    //     //     ticketsIds += ticketInfo[i].ticketId + '_';
    //     //     busScheduleIds += ticketInfo[i].busScheduleId + '_';
    //     // }
    //     successUrl = `${mainUrl}/paymentSuccess/\\${busScheduleIds}/\\${ticketsIds}`;
    // } else if (transportType === 'train') {
    //     // for (let i = 0; i < ticketInfo.length; i++) {
    //     //     ticketsIds += ticketInfo[i].ticketId + '_'; 
    //     //     trainScheduleIds += ticketInfo[i].trainScheduleId + '_';
    //     // }
    //     successUrl = `${mainUrl}/paymentSuccessTrain/\\${trainScheduleIds}/\\${ticketsIds}`;
    // } else if (transportType === 'air') {
    //     // for (let i = 0; i < ticketInfo.length; i++) {
    //     //     ticketsIds += ticketInfo[i].ticketId + '_';
    //     //     airScheduleIds += ticketInfo[i].schedule_id + '_';
    //     // }
    //      successUrl = `${mainUrl}/paymentSuccessAir/\\${airScheduleIds}/\\${ticketsIds}`;
        
    // }

    //  create successUrl [air]
  successUrl = `${mainUrl}/success/\\${air_schedule_id}`;

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
        text: `INSERT into "info" (schedule_id, username, seat_booked, seat_booked_string, class_name,transaction_id, paid_status, details, amount) VALUES ($1, $2, $3, $4, $5 , $6, $7 , $8, $9) RETURNING *`,
        values: [ air_schedule_id, user_name, seat_booked , seat_booked_string, class_name , transactionId, 'false', details, grandTotalFare]
      }
      const result = await airPool.query(getTicketInfoQuery);
      console.log(result);
      // res.redirect(GatewayPageURL);
      // const result = paymentPool.query('INSERT INTO payment_info (transaction_id, paid_status) VALUES ($1, $2)', 
      // [finalOrder.transactionId, finalOrder.paidStatus]);

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
  const { air_schedule_id  } = req.body;
  console.log(req.body);  
  const ssl = new SSLCommerzPayment(store_id, store_passwd, is_live)
  const validation = ssl.validate(data);
  validation.then(validation => {
      console.log('Validation success');
      console.log(validation);
  }).catch(error => {
      console.log(error);
  }); 

  const transactionId = data.tran_id;
  const paymentMedium = data.card_issuer;
  // const airScheduleIdArray = airScheduleIds.split('_');
  // const ticketIdArray = ticketIds.split('_');
  console.log(transactionId, paymentMedium, air_schedule_id)
    try{
        // const getTicketInfo = await airPool.query('SELECT * FROM info WHERE ticket_id = $1', [ticket_id]);
      const updatePaidStatus = {
          text: `UPDATE "info" SET paid_status = $1 WHERE transaction_id = $2`,
          values: ['true', transactionId]
      }
      const result = await airPool.query(updatePaidStatus);
      console.log(result);

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


const paymentFail = async (req, res) => {

  /** 
  * If payment failed 
  */
  console.log("Failed API ")
  console.log(req.body);

  const data = req.body;
  const transactionId = data.tran_id;

  try{

    //console.log(-1)

    // const selectquery = {

    //   text: `SELECT * FROM "info" WHERE transaction_id = $1`,
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
        text: 'DELETE from "info" WHERE transaction_id = $1',
        values: [ transactionId]
    }
  const delresult = await airPool.query(deletequery);
  console.log(delresult);

} catch {

  //console.log(-3)

}

  return res.status(200).json(
    {
      data: req.body,
      message: 'Payment failed'
    }
  );
}


module.exports = {
  paymentInit,
  paymentSuccessAir,
  paymentFail,

}