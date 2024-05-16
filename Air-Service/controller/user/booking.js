const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const airPool = require('../../config/airDB.js');
const crypto = require('../../utils.js');
const secret = process.env.secret
const { query } = require('express');

dotenv.config();

//before payment transaction
const temporarySeatBooking = async (req, res) => {
    //authentication lagbe
    // req.body.user_name = 'X-33' ;
    //req.body.schedule_id = 1 ;
    //req.body.class_name = 'economy' ;
    //req.body.booked_deatils = [[0,0,1],[0,1,1],[0,2,1]] ;
    obj = req.body ;

    console.log(obj)

    //transaction starting

    if(!obj.accesstoken) {
        return res.status(400).json({message: "Invalid token"});
    }

    jwt.verify(obj.accesstoken, secret, async (err, decodedToken) => {

        if(err) {
            console.log(err);
            return res.status(400).json({message: "Invalid token"});
        }
        try{
            const query1 = {
                text : 'SELECT class_id FROM "class_info" WHERE class_name = $1',
                values : [obj.class_name]
            }
            let class_id = (await airPool.query(query1)).rows[0].class_id;
        
            console.log(class_id) ;
            airPool.query('BEGIN') ;
            console.log("temporarySeatBooking") ;
        // console.log(obj) ;
            const dimension_query = {
                text : 'SELECT "air_details".dimensions,"air_details".classes FROM "air_details" JOIN "air_schedule_info" ON "air_schedule_info".air_id = "air_details".air_id  WHERE schedule_id = $1',
                values : [obj.schedule_id]
            }
            let dimension = -1 ;
            const {dimensions,classes} = (await airPool.query(dimension_query)).rows[0] ;
            for(let i = 0 ; i < classes.length ; i++) {
                if(classes[i] == class_id) {
                    dimension = dimensions[i] ;
                    class_id = i+1 ;
                    break ;
                }
            }
            console.log(class_id) ;
            for(let i = 0 ; i < obj.booked_details.length ; i++) {
                // console.log(dimension[1]*obj.booked_deatils[i][0]+obj.booked_deatils[i][1]) ;
                const query2 = {
                    text : 'UPDATE "air_schedule_info" SET seat_details[$1][$2][$3] = $4 WHERE schedule_id = $5',
                    values : [class_id,dimension[1]*obj.booked_details[i][0]+obj.booked_details[i][1]+1,3,1,obj.schedule_id]
                }
                await airPool.query(query2) ;
            }
            await airPool.query('COMMIT') ;

            res.status(200).json({message: "Seat Booked"}) ;


        }catch(err) {
            await airPool.query('ROLLBACK') ;
            console.log(err) ;
            res.status(500).json({message: "Internal Server Error"}) ;
        }
    })

};

const cancelBooking = async(req,res) => {
    let obj = req.body ;
    console.log(obj) ;
    if(!obj.accesstoken) {
        return res.status(400).json({message: "Invalid token"});
    }

    jwt.verify(obj.accesstoken, secret, async (err, decodedToken) => {

        if(err) {
            console.log(err);
            return res.status(400).json({message: "Invalid token"});
        }
        try{
            //at first find all the values from the info table
            const query0 = {
                text : 'SELECT * FROM "info" WHERE ticket_id = $1',
                values : [obj.ticket_id]
            }
            const data = (await airPool.query(query0)).rows[0] ;
            console.log(data) ;

            //check if the cancel date in schedule info is bigger than today
            const checkQuery ={
                text : 'SELECT * from "air_schedule_info" WHERE schedule_id = $1 and cancel_deadline >= $2',
                values : [obj.schedule_id,new Date()]
            }
            const check = (await trainPool.query(checkQuery)).rows[0] ;
            if(check.length == 0) {
                res.status(400).json({message: "Can't cancel the booking"}) ;
                return ;
            }
            //delete the entry from the info table using id
            // const query1 = {
            //     text : 'DELETE FROM "info" WHERE ticket_id = $1',
            //     values : [obj.ticket_id]
            // }
            // await trainPool.query(query1) ;

            const query3 = {
                text : 'SELECT class_id FROM "class_info" WHERE class_name = $1',
                values : [data.class_name]
            }
            let class_id = (await airPool.query(query3)).rows[0].class_id;
        
            console.log(class_id) ;
            console.log("temporarySeatBooking") ;
            console.log(data) ;
            const dimension_query = {
                text : 'SELECT "air_details".dimensions,"air_details".classes FROM "air_details" JOIN "air_schedule_info" ON "air_schedule_info".flight_id = "air_details".flight_id  WHERE schedule_id = $1',
                values : [data.schedule_id]
            }

            let dimension = -1 ;
            let c_id = -1 ;
            console.log(dimension,c_id)
            let {dimensions,coaches} = (await trainPool.query(dimension_query)).rows[0] ;
            for (let i = 0 ; i < coaches.length ; i++) {
                console.log(coaches[i],coach_id) ;
                if(coaches[i] == coach_id) {
                    dimension = dimensions[i] ;
                    c_id = i+1 ;
                    break ;
                }
            }
            console.log(dimension,c_id)
            // console.log(data.booked_details.length)
            for(let i = 0 ; i < data.seat_booked.length ; i++) {
                //update two collumns
                const query2 = {
                    text : 'UPDATE "train_schedule_info" SET seat_details[$1][$2][$3] = $4 WHERE schedule_id = $5',
                    values : [c_id,dimension[1]*data.seat_booked[i][0]+data.seat_booked[i][1]+1,3,0,data.schedule_id]
                }
                await trainPool.query(query2) ;
            }

            res.status(200).json({message: "Booking Cancelled"}) ;

            

            //update the seat_details of the schedule

        }catch(err){
            console.log(err) ;
            res.status(500).json({message: "Internal Server Error"}) ;

        }
    }) ;
}

const history = async (req,res) => {
    let obj = req.body ;
    console.log(obj) ;
    if(!obj.accesstoken) {
        return res.status(400).json({message: "Invalid token"});
    }

    jwt.verify(obj.accesstoken, secret, async (err, decodedToken) => {

        if(err) {
            console.log(err);
            return res.status(400).json({message: "Invalid token"});
        }
        try{
            const query1 = {
                text : 'SELECT * FROM "info" LEFT JOIN "air_schedule_info" ON info.schedule_id = air_schedule_info.schedule_id LEFT JOIN "air_services" ON air_schedule_info.air_id = air_services.air_id WHERE username = $1',
                values : [obj.user_name]
            }
            let data = (await airPool.query(query1)).rows ;
            res.status(200).json(data) ;
        }catch(err){
            console.log(err) ;
            res.status(500).json({message: "Internal Server Error"}) ;
        }
    }) ;
}

module.exports = {
    temporarySeatBooking,cancelBooking,history
}