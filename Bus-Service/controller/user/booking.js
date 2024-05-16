const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const server = require('../../config/busDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');

dotenv.config();
const secret = process.env.secret;
const busPool = server.busPool

// //before payment transaction
 const seatBooking = async (req, res) => {
//     //authentication lagbe
//     // req.body.user_name = 'X-33' ;
//     // req.body.schedule_id = 1 ;
//     // req.body.coach_name = 'AC_S' ;
//     // req.body.booked_deatils = [[0,0,1,0],[0,1,1,0],[0,2,1,0]];
//     // obj = req.body ;

     obj = req.body ;

     console.log(obj)

//     //transaction starting

//     if(!obj.accesstoken) {
//         return res.status(400).json({message: "Invalid token"});
//     }

//     jwt.verify(obj.accesstoken, secret, async (err, decodedToken) => {

//         if(err) {
//             console.log(err);
//             return res.status(400).json({message: "Invalid token"});
//         }


//         //transaction starting
         try{
             busPool.query('BEGIN') ;
            //  const query1 = {
            //     text : 'SELECT bus_id FROM "bus_details" WHERE coach_name = $1',
            //     values : [obj.coach_name]
            //  }
            // let coach_id = (await trainPool.query(query1)).rows[0].coach_id;
        
//             console.log(coach_id) ;
//             console.log("temporarySeatBooking") ;
//             console.log(obj) ;
            const dimension_query = {
                text : 'SELECT "bus_details".dimension,"bus_details".last_middle FROM "bus_details" JOIN "bus_schedule_info" ON "bus_schedule_info".bus_name = "bus_details".bus_name  WHERE schedule_id = $1',
                values : [obj.schedule_id]
            }

            const {dimension, last_middle} = ( await busPool.query(dimension_query) ).rows[0] ;

            console.log(dimension,last_middle)

//             let dimension = -1 ;
//             let c_id = -1 ;
//             console.log(dimension,c_id)
//             let {dimensions,coaches} = (await trainPool.query(dimension_query)).rows[0] ;
//             for (let i = 0 ; i < coaches.length ; i++) {
//                 console.log(coaches[i],coach_id) ;
//                 if(coaches[i] == coach_id) {
//                     dimension = dimensions[i] ;
//                     c_id = i+1 ;
//                     break ;
//                 }
//             }
//             console.log(dimension,c_id)
             for(let i = 0 ; i < obj.booked_details.length ; i++) {
//                 //update two collumns

                if(obj.booked_details[i][0] != -1 && obj.booked_details[i][0] != -1){

                    //console.log( dimension[1],obj.booked_details[i][0] , obj.booked_details[i][1],1 , last_middle )

                    const query2 = {
                        text : 'UPDATE "bus_schedule_info" SET seat_details[$1][$2] = $3 WHERE schedule_id = $4',
                        values : [ dimension[1]*obj.booked_details[i][0] + obj.booked_details[i][1]+1 + last_middle,3,1,obj.schedule_id]
                    }
                    await busPool.query(query2) ;

                }

                else{

                    const query3 = {
                        text : 'UPDATE "bus_schedule_info" SET seat_details[$1][$2] = $3 WHERE schedule_id = $4',
                        values : [1,3,1,obj.schedule_id]
                    }
                    await busPool.query(query3) ;


                }
                
             }
//             await trainPool.query('COMMIT') ;
//             res.status(200).json({message: "Seat Booked"}) ;


        }catch(err) {
            await busPool.query('ROLLBACK') ;
            console.log(err) ;
            res.status(500).json({message: "Internal Server Error"}) ;
        }
//     })

 };

module.exports = {
    seatBooking,
}