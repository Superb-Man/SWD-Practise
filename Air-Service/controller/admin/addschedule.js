const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const airPool = require('../../config/airDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');

dotenv.config();
//token check hobe
const secret = process.env.secret;

const addschedule = async (req, res) => {  
    try{
        req.body.schedule_id = 6 ;
        req.body.air_id = 3 ;
        req.body.flight_id = "FL-x9" ;
        req.body.from = 'Chittagong' ;
        req.body.to = 'Dhaka' ;
        req.body.departure_date = new Date("2024-01-30") ;
        req.body.departure_time = "14:00:00" ;
        req.body.arrival_date = new Date("2024-01-30") ;
        req.body.arrival_time = "19:50:00" ;
        req.body.cost_class = [4900,6000,8000] ;
        console.log(req.body)
        //air_schedule_info
        //schedule_id,air_id,flight_id,from,to,departure_date,departure_time,arrival_date,arrival_time,cost_class
        let obj = {"schedule_id":req.body.schedule_id,"air_id":req.body.air_id,"flight_id":req.body.flight_id,"from":req.body.from,"to":req.body.to,"cost_class" : req.body.cost_class,"departure_date":req.body.departure_date,"departure_time":req.body.departure_time,"arrival_date":req.body.arrival_date,"arrival_time":req.body.arrival_time};
        
        const query1 = {
            text : 'SELECT dimensions,classes from "air_details" WHERE air_id = $1 and flight_id = $2',
            values : [obj.air_id,obj.flight_id]
        }
        const result1 = (await airPool.query(query1)).rows[0];
        console.log(result1.classes.length);
        let max_row = 0 ;
        let max_col = 0 ;   
        for(let i = 0;i<result1.classes.length;i++){
            if(result1.dimensions[i][0]>max_row){
                max_row = result1.dimensions[i][0];
            }
            if(result1.dimensions[i][1]>max_col){
                max_col = result1.dimensions[i][1];
            }
        }
        // console.log(result.dimensions[0][0]);
        
        
        let seat_details = [];
        for(let i = 0;i<result1.classes.length;i++){
            let class_details = [] ;
            for(let j = 0;j<max_row;j++){
                for(let k = 0;k<max_col;k++){
                    if(j<result1.dimensions[i][0] && k<result1.dimensions[i][1]){
                        class_details.push([j,k,0]);
                    }
                    else {
                        class_details.push([-1,-1,-1]);
                    
                    }
                }
            
            }
            seat_details.push(class_details);
        }
        console.log(seat_details);

        req.body.seat_details = seat_details ;


        const query2 = {
            text : 'INSERT INTO "air_schedule_info" (schedule_id,air_id,flight_id,from_port,to_port,cost_class,departure_date,departure_time,arrival_date,arrival_time,seat_details) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
            values : [obj.schedule_id,obj.air_id,obj.flight_id,obj.from,obj.to,obj.cost_class,obj.departure_date,obj.departure_time,obj.arrival_date,obj.arrival_time,req.body.seat_details]
        }
        const result2 = await airPool.query(query2);
        // console.log(result.rows);

        //booked_details

        res.status(200).json({message: "Schedule added"}) ;
    
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
} ;

module.exports = { addschedule };