const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const server = require('../../config/trainDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');

dotenv.config();
//token check hobe
const secret = process.env.secret;

const trainPool = server.trainPool ;
const trainPool2 = server.trainPool2 ;

const add_train_company = async (req, res) => {
    try {
        //checking if same train company added
        const query = {
            text: 'SELECT * FROM "train_company" WHERE company_name = $1',
            values: [req.body.company_name]
        }
        const result = await trainPool.query(query);
        if (result.rows.length > 0) {
            res.status(400).json({ message: "Train company already exists" });
            return;
        }
        const { company_name, company_email, company_phone, company_address, company_license } = req.body;
        const query1 = {
            text: 'INSERT INTO "train_company" (company_name, company_email, company_phone, company_address, company_license) VALUES ($1, $2, $3, $4, $5)',
            values: [company_name, company_email, company_phone, company_address, company_license]
        }
        const result1 = await trainPool.query(query1);
        res.status(200).json({ message: "Train company added" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



const add_train = async (req, res) => {
    try {
        //checking if same train added
        const query = {
            text: 'SELECT * FROM "train_details" WHERE train_uid = $1',
            values: [req.body.train_uid]
        }
        const result = await trainPool.query(query);
        if (result.rows.length > 0) {
            res.status(400).json({ message: "Train already exists" });
            return;
        }
        const { train_uid, train_name, train_type, train_category, train_classes, train_coaches, train_dimensions, train_routes, train_stations, train_departure, train_arrival, train_stops, train_days, train_fare } = req.body;
        const query1 = {
            text: 'INSERT INTO "train_details" (train_uid, train_name, train_type, train_category, train_classes, train_coaches, train_dimensions, train_routes, train_stations, train_departure, train_arrival, train_stops, train_days, train_fare) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12, $13, $14)',
            values: [train_uid, train_name, train_type, train_category, train_classes, train_coaches, train_dimensions, train_routes, train_stations, train_departure, train_arrival, train_stops, train_days, train_fare]
        }
        const result1 = await trainPool.query(query1);
        res.status(200).json({ message: "Train added" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const add_coach_details = async (req, res) => {
    //add coach_details of an specific train_uid
    try {
        const { train_uid, coach_id, coach_type, coach_classes, coach_dimensions, coach_fare } = req.body;
        const query1 = {
            text: 'INSERT INTO "coach_details" (train_uid, coach_id, coach_type, coach_classes, coach_dimensions, coach_fare) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [train_uid, coach_id, coach_type, coach_classes, coach_dimensions, coach_fare]
        }
        const result1 = await trainPool.query(query1);
        res.status(200).json({ message: "Coach details added" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const add_route = async (req, res) => {
    //add route of an specific train_uid
    try {
        const { train_uid, route_id, route_name, route_distance, route_time } = req.body;
        const query1 = {
            text: 'INSERT INTO "train_routes" (train_uid, route_id, route_name, route_distance, route_time) VALUES ($1, $2, $3, $4, $5)',
            values: [train_uid, route_id, route_name, route_distance, route_time]
        }
        const result1 = await trainPool.query(query1);
        res.status(200).json({ message: "Route added" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}







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

module.exports = { add_train_company, add_train, add_coach_details, add_route, addschedule };