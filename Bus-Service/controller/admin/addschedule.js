const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const server = require('../../config/busDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');
const utils = require('../admin/train.js');

dotenv.config();
//token check hobe
const secret = process.env.secret;

const busPool = server.busPool ;
//const trainPool2 = server.trainPool2 ;


const addschedule = async (req, res) => {  
    try{
        busPool.query('BEGIN') ;
        req.body.schedule_id = 7 ;
        req.body.bus_id = 3 ;
        req.body.bus_name = "117 DHK-KHU" ;
        req.body.source = "Dhaka";
        req.body.destination = "Khulna"

        req.body.boarding = [

            {
                checkpoint : "Gulistan 1",
                counter : "21:00:00",
            },
            
            
            {
                checkpoint : "Jonopoth Mour 1",
                timestamp : "21:30:00",
                // departure_date : new Date("2024-02-01"),
                //cost_class: [130,200,350,420],
            },

            {
                checkpoint : "Dholaipar 2",
                timestamp : "21:45:00",
                // departure_date : new Date("2024-02-01"),
                //cost_class: [130,200,350,420],
            },

            

            
            
            
            
            
        ]

        req.body.dropping = [
            

            
            

            {
                checkpoint : "Royal More",
                timestamp : "1:40:00",
            },

            

            {
                checkpoint : "Fultola",
                counter : "1:45:00",
            },

        
            
            
        ]

        req.body.departure_date = new Date("2024-03-14") ;

        req.body.cost = 650
        //req.body.arrival_date = new Date("2024-02-01") ;
        console.log(req.body)


        let obj = {"schedule_id":req.body.schedule_id,"bus_id":req.body.bus_id,"bus_name":req.body.bus_name,"boarding":req.body.boarding,"departure_date":req.body.departure_date,"dropping":req.body.dropping, "cost": req.body.cost, "source": req.body.source, "destination": req.body.destination};
        
        const query1 = {
            text : 'SELECT dimension,category from "bus_details" WHERE bus_id = $1 and bus_name = $2',
            values : [obj.bus_id,obj.bus_name]
        }

        


        const result1 = (await busPool.query(query1)).rows[0];
        console.log(result1);
        //console.log(result1.coaches.length);
        // let max_row = 0 ;
        // let max_col = 0 ;   
        // for(let i = 0;i<result1.coaches.length;i++){
        //     if(result1.dimensions[i][0] * result1.dimensions[i][2]>max_row){
        //         max_row = result1.dimensions[i][0] * result1.dimensions[i][2];
        //     }
        //     if(result1.dimensions[i][1]>max_col){
        //         max_col = result1.dimensions[i][1];
        //     }
        // }


        //console.log(max_row) ;
        
        
        let seat_details = [];
        
        for(let j = 0;j<result1.dimension[0];j++){
            for(let k = 0;k<result1.dimension[1];k++){
                //if(j<result1.dimensions[i][0] * result1.dimensions[i][2] && k<result1.dimensions[i][1]){
                    //console.log(j,result1.dimensions[i][2],parseInt(j/result1.dimensions[i][2])) ;
                     seat_details.push([j,k,0]);
                    //else seat_details.push([j,k,1]);
                // }
                // else {
                //     class_details.push([-1,-1,-1,-1]);
                    
                // }
            }
            
        }
        //seat_details.push(class_details);
        
        console.log(seat_details);

        req.body.seat_details = seat_details ;


        const query2 = {
             text : 'INSERT INTO "bus_schedule_info" (schedule_id,bus_id,bus_name,departure_date,cost,boarding,dropping,seat_details,source,destination) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
             values : [obj.schedule_id, obj.bus_id, obj.bus_name, obj.departure_date, obj.cost, obj.boarding, obj.dropping, req.body.seat_details, obj.source, obj.destination]
        }
         const result2 = await busPool.query(query2);

        //booked_details

        res.status(200).json({message: "Schedule added"}) ;
    
    }catch(err){
        await busPool.query('ROLLBACK') ;
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
} ;

// const getSeatAvailableBySchedule = async (req, res) => {
//     try{
//         let obj = {
//             schedule_id : req.params.schedule_id ,
//             train_uid : req.params.train_uid,
//             coach_name : req.params.coach_name,
//         }

//         const dimensionsAndCoaches = await utils.findIndexofCoach(obj.train_uid,obj.coach_name);
//         //write a query to find seat_details from schedule info table
//         const query1 = {
//             text : 'SELECT seat_details from "train_schedule_info" WHERE schedule_id = $1 and train_uid = $2',
//             values : [obj.schedule_id,obj.train_uid]
//         }
//         const results = (await trainPool.query(query1));

//         let dimension = dimensionsAndCoaches.dimensions;
//         let coach_idx = dimensionsAndCoaches.idx;
//         let available = 0 ;
//         for(let i = 0;i<dimension[0]*dimension[2] *dimension[1];i++){
//             if(results[0].seat_details[coach_idx][i][2] == 0){
//                 available++ ;
//             }
//         }
        
//         let train_result = {
//             schedule_id : obj.schedule_id,
//             train_uid : obj.train_uid ,
//             coach_name : obj.coach_name,
//             dimension: dimension, //compart_Ment,col,row
//             seat_details : results[0].seat_details[coach_idx], //for each =========>[row,col,status,compartment]
//             available : available,
//         }
//             // }
//         // }

//         res.status(200).json(train_result);

//     }catch (err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// }


module.exports = {addschedule };