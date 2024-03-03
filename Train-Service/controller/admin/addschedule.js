const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const server = require('../../config/trainDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');
const utils = require('../admin/train.js');
const mail  = require('./mail.js');
const queryUtils = require('../user/queryUtils.js');

dotenv.config();
//token check hobe
const secret = process.env.secret;

const trainPool = server.trainPool ;
const trainPool2 = server.trainPool2 ;


async function addSeatDetails(obj) {
    const query1 = {
        text : 'SELECT dimensions,coaches from "train_details" WHERE train_id = $1 and train_uid = $2',
        values : [obj.train_id,obj.train_uid]
    }


    const result1 = (await trainPool.query(query1)).rows[0];
    console.log(result1);
    console.log(result1.coaches.length);
    let max_row = 0 ;
    let max_col = 0 ;   
    for(let i = 0;i<result1.coaches.length;i++){
        if(result1.dimensions[i][0] * result1.dimensions[i][2]>max_row){
            max_row = result1.dimensions[i][0] * result1.dimensions[i][2];
        }
        if(result1.dimensions[i][1]>max_col){
            max_col = result1.dimensions[i][1];
        }
    }


    console.log(max_row) ;
    
    
    let seat_details = [];
    for(let i = 0;i<result1.coaches.length;i++){
        let class_details = [] ;
        for(let j = 0;j<max_row;j++){
            for(let k = 0;k<max_col;k++){
                if(j<result1.dimensions[i][0] * result1.dimensions[i][2] && k<result1.dimensions[i][1]){
                    console.log(j,result1.dimensions[i][2],parseInt(j/result1.dimensions[i][2])) ;
                    class_details.push([j,k,0,parseInt(j/result1.dimensions[i][2])]);
                }
                else {
                    class_details.push([-1,-1,-1,-1]);
                
                }
            }
        
        }
        seat_details.push(class_details);
    }
    console.log(seat_details);

    return seat_details ;
}

const addschedule = async (req, res) => {  
    try{
        trainPool.query('BEGIN') ;
        console.log(req.body)


        let obj = {"train_uid":req.body.train_uid,"train_id":req.body.train_id,"routes":req.body.routes,"booking":req.body.booking,"cancel_deadline" :new Date(req.body.cancel_deadline)};


        let newObj = {
            train_uid : req.body.train_uid,
            train_id : req.body.train_id,
        }
        obj.seat_details = await addSeatDetails(newObj);
        console.log(obj.train_id) ;
        const query2 = {
            text : 'INSERT INTO "train_schedule_info" (train_id,train_uid,routes,seat_details,booking,cancel_deadline) VALUES ($1,$2,$3,$4,$5,$6)',
            values : [obj.train_id,obj.train_uid,obj.routes,obj.seat_details,obj.booking,obj.cancel_deadline]
        }
        await trainPool.query(query2);
        trainPool.query('COMMIT') ;

        //booked_details

        res.status(200).json({message: "Schedule added"}) ;
    
    }catch(err){
        await trainPool.query('ROLLBACK') ;
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
} ;

const updateBookingStatus = async(req,res) => {
    try{
        req.body.schedule_id = 1 ;
        req.body.booking = 1 ;
        req.body.cancel_deadline = new Date(req.body.cancel_deadline) ;
        const query2 = {
            text : 'UPDATE "train_schedule_info" SET booking = $1,cancel_deadline = $2 WHERE schedule_id = $3',
            values : [req.body.booking,req.body.cancel_deadline,req.body.schedule_id]
        }
        const result2 = await trainPool.query(query2); 
    }catch (err) {

    }
}

const getSeatAvailableBySchedule = async (req, res) => {
    try{
        let obj = {
            schedule_id : req.params.schedule_id ,
            train_uid : req.params.train_uid,
            coach_name : req.params.coach_name,
        }

        const dimensionsAndCoaches = await utils.findIndexofCoach(obj.train_uid,obj.coach_name);
        //write a query to find seat_details from schedule info table
        const query1 = {
            text : 'SELECT seat_details from "train_schedule_info" WHERE schedule_id = $1 and train_uid = $2',
            values : [obj.schedule_id,obj.train_uid]
        }
        const results = (await trainPool.query(query1));

        let dimension = dimensionsAndCoaches.dimensions;
        let coach_idx = dimensionsAndCoaches.idx;
        let available = 0 ;
        for(let i = 0;i<dimension[0]*dimension[2] *dimension[1];i++){
            if(results[0].seat_details[coach_idx][i][2] == 0){
                available++ ;
            }
        }
        
        let train_result = {
            schedule_id : obj.schedule_id,
            train_uid : obj.train_uid ,
            coach_name : obj.coach_name,
            dimension: dimension, //compart_Ment,col,row
            seat_details : results[0].seat_details[coach_idx], //for each =========>[row,col,status,compartment]
            available : available,
        }
            // }
        // }

        res.status(200).json(train_result);

    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const updateSchedule = async(req,res) => {
    console.log(req.body);
    try{
        req.body.subject = "Train Schedule Update" ;
        let toList = [] ;
        //at first find the user,schedule_id,ticket_id from schedule_info table with info using schedule_id
        const query1 = {
            text : `SELECT "info".username,"info".schedule_id,"info".ticket_id,"info".details from 
                    "info" JOIN "train_schedule_info" as 
                    "schedule" ON "info".schedule_id = "schedule".schedule_id WHERE "info".schedule_id = $1`,
            values : [req.body.schedule_id]
        }
        const results = (await trainPool.query(query1)).rows ;
        //join on AccountDB to get user_email
        //update the routes and booking column using schedule_id
        const query3 = {
            text : 'UPDATE "train_schedule_info" SET routes = $1,booking = $2 WHERE schedule_id = $3',
            values : [req.body.routes,req.body.booking,req.body.schedule_id]
        }
        console.log(results);
        const result3 = (await trainPool.query(query3));
        for(let i = 0;i<results.length;i++){
            const query2 = {
                text : 'SELECT email from "clients" WHERE username = $1',
                values : [results[i].username] ,
            }
            const email = (await accountPool.query(query2)).rows[0];
            console.log(email);
            to = 'kaziistiak253@gmail.com';
            const newTimeQuery = {
                text:'SELECT routes from "train_schedule_info" WHERE schedule_id = $1',
                values : [req.body.schedule_id]
            }
            //map to date and departure time using start 
            let newTime = (await trainPool.query(newTimeQuery)).rows[0] ;
            console.log(newTime) ;
            //map to date and departure time using start
            newTime = newTime.routes.filter(route=>route.start.localeCompare(results[i].details.start) === 0).map(route=>({date:route.date,time:route.departure_time}))[0];
            console.log("newTime",newTime) ;
            // start_details have start,time,date
            req.body.message +="\nPrevious schedule :\n" + results[i].details.start +" to "+ results[i].details.dest +"\n";
            req.body.message+="Time : "+results[i].details.time +"\nDate : "+ new Date(results[i].details.date).toLocaleDateString() +"\n";
            req.body.message+="New schedule date :"+new Date(newTime.date).toLocaleDateString()+ " and time : "+ newTime.time+"\n";
            await mail.mailing(to,req.body.subject,req.body.message);
        }
        res.status(200).json({message: "Schedule Updated"});

    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    
    }
} ;

const getScheduleByUID = async (req, res) => {
    try{
        //select all from train_schedule_info
        const query1 = {
            text : 'SELECT * from "train_schedule_info" WHERE train_uid = $1',
            values : [req.params.train_uid]
        }

        const results = (await trainPool.query(query1)).rows ;
        let train_results = [] ;

        for(let i = 0;i<results.length;i++){
            let l = results[i].routes.length ;
            let times = queryUtils.timeDifference(new Date(results[i].routes[0].date),new Date(results[i].routes[l-1].date),results[i].routes[0].departure_time,results[i].routes[l-1].departure_time);
            let train_result = {
                schedule_id : results[i].schedule_id,
                train_id : results[i].train_id,
                train_uid : results[i].train_uid ,
                routes : results[i].routes,
                duration_hour :times.hours,
                duration_minutes : times.minutes,
                durations : times.durations,
                departure_date : new Date(results[i].routes[0].date), 
                departure_time : results[i].routes[0].time,
                arrival_date :  new Date(results[i].routes[l-1].date),
                arrival_time : results[i].routes[l-1].time,
                routes : results[i].routes,
                booking : results[i].booking,
                cancel_deadline : results[i].cancel_deadline,
            }
            train_results.push(train_result) ;
        }
        //sort
        // train_results.sort((a,b) => {
        //     return (new Date() - new Date(a.departure_date);
        // }
        res.status(200).json(train_results);

    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }

}

const getSeatInfoBySchedule = async (req, res) => {
    try{
        console.log("here") ;
        // req.body.schedule_id = 1 ;
        // req.body.train_uid = "Agnibina-735" ;
        //join three tables train_schedule_info,train_details,coach_info
        //join coach_info to find coachName too
        const query1 = {
            text : `SELECT "schedule".schedule_id,"schedule".train_uid,"schedule".seat_details,"details".dimensions,"details".coaches
                    FROM "train_schedule_info" as "schedule" JOIN "train_details" as "details" ON "schedule".train_uid = "details".train_uid
                    WHERE "schedule".schedule_id = $1 and "schedule".train_uid = $2`,
            values : [req.body.schedule_id,req.body.train_uid]
        }
        let results = (await trainPool.query(query1)).rows[0] ;
        let coaches_details = await utils.getAllCoaches(req.body.train_uid) ;
        // console.log(coaches_details);
        // console.log(results) ;

        //count the number of each coaches whose tickets are still availabale
        let ticketAvailable = [] ;
        for(let i = 0 ; i < results.coaches.length ; i++){
            let tickets = 0 ;
            // console.log(results.seat_details[i].length)
            for(let j = 0 ; j < coaches_details.dimensions[i][0]*coaches_details.dimensions[i][1] * coaches_details.dimensions[i][2] ; j++){
                // console.log(results.seat_details[i][j]);
                if(results.seat_details[i][j][2] === 0){
                    tickets++ ;
                }
            }
            ticketAvailable.push(tickets) ;
        }
        // map coach_NAME, TICKET available into coaches 
        let coach_details = coaches_details.coaches.map((value,index) => {
            return { coach: value, available: ticketAvailable[index], seat_details: results.seat_details[index],dimensions: results.dimensions[index]};
        });
        res.status(200).json(coach_details);
        // const coaches = await utils.getAllCoaches(req.body.train_uid);
        // res.status(200).json(results);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}


module.exports = {addschedule,getSeatAvailableBySchedule,updateSchedule,getScheduleByUID,getSeatInfoBySchedule,updateBookingStatus};