const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const trainPool = require('../../config/trainDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');

dotenv.config();
//token check hobe
const secret = process.env.secret;

const addschedule = async (req, res) => {  
    try{
        trainPool.query('BEGIN') ;
        req.body.schedule_id = 10 ;
        req.body.train_id = 2 ;
        req.body.train_uid = "Shugandha-744" ;
        req.body.routes = ["Dhaka","NarayanGanj","Feni","Chittagong"]

        req.body.routes = [
            {
                start : "Dhaka",
                departure_time : "10:00:00",
                // departure_date : new Date("2024-02-01"),
                cost_class: [130,200,350,420],
            },
            {
                start : "NarayanGanj",
                departure_time : "11:00:00",
                cost_class: [150,220,400,450],
            },
            {
                start : "Feni",
                departure_time : "16:00:00",
                cost_class: [300,340,500,690], 
            },
            {
                start : "Chittagong",
                departure_time : "17:00:00",
                cost_class: [400,480,620,790],
            }
        ]

        req.body.departure_date = new Date("2024-02-01") ;
        req.body.arrival_date = new Date("2024-02-01") ;
        console.log(req.body)


        let obj = {"schedule_id":req.body.schedule_id,"train_uid":req.body.train_uid,"train_id":req.body.train_id,"routes":req.body.routes,"departure_date":req.body.departure_date,"arrival_date":req.body.arrival_date};
        
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

        req.body.seat_details = seat_details ;


        const query2 = {
            text : 'INSERT INTO "train_schedule_info" (schedule_id,train_id,train_uid,routes,departure_date,arrival_date,seat_details) VALUES ($1,$2,$3,$4,$5,$6,$7)',
            values : [obj.schedule_id,obj.train_id,obj.train_uid,obj.routes,obj.departure_date,obj.arrival_date,req.body.seat_details]
        }
        const result2 = await trainPool.query(query2);

        //booked_details

        res.status(200).json({message: "Schedule added"}) ;
    
    }catch(err){
        await trainPool.query('ROLLBACK') ;
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
} ;

module.exports = { addschedule };