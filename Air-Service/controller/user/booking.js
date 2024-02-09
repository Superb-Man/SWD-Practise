const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const airPool = require('../../config/airDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');

dotenv.config();

//before payment transaction
const temporarySeatBooking = async (req, res) => {
    //authentication lagbe
    // req.body.user_name = 'X-33' ;
    req.body.schedule_id = 1 ;
    req.body.class_name = 'economy' ;
    req.body.booked_deatils = [[0,0,1],[0,1,1],[0,2,1]] ;
    obj = req.body ;

    //transaction starting
    try{
        const query1 = {
            text : 'SELECT class_id FROM "class_info" WHERE class_name = $1',
            values : [obj.class_name]
        }
        let class_id = (await airPool.query(query1)).rows[0].class_id;
    
        console.log(class_id) ;
        airPool.query('BEGIN') ;
        console.log("temporarySeatBooking") ;
        console.log(obj) ;
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
        for(let i = 0 ; i < obj.booked_deatils.length ; i++) {
            // console.log(dimension[1]*obj.booked_deatils[i][0]+obj.booked_deatils[i][1]) ;
            const query2 = {
                text : 'UPDATE "air_schedule_info" SET seat_details[$1][$2][$3] = $4 WHERE schedule_id = $5',
                values : [class_id,dimension[1]*obj.booked_deatils[i][0]+obj.booked_deatils[i][1]+1,3,1,obj.schedule_id]
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

};

module.exports = {
    temporarySeatBooking
}