const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const busPool = require('../../config/busDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');

dotenv.config();
const secret = process.env.secret;

// //before payment transaction
// const temporarySeatBooking = async (req, res) => {
//     //authentication lagbe
//     // req.body.user_name = 'X-33' ;
//     // req.body.schedule_id = 1 ;
//     // req.body.coach_name = 'AC_S' ;
//     // req.body.booked_deatils = [[0,0,1,0],[0,1,1,0],[0,2,1,0]];
//     // obj = req.body ;

//     obj = req.body ;

//     console.log(obj)

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
//         try{
//             trainPool.query('BEGIN') ;
//             const query1 = {
//                 text : 'SELECT coach_id FROM "coach_info" WHERE coach_name = $1',
//                 values : [obj.coach_name]
//             }
//             let coach_id = (await trainPool.query(query1)).rows[0].coach_id;
        
//             console.log(coach_id) ;
//             console.log("temporarySeatBooking") ;
//             console.log(obj) ;
//             const dimension_query = {
//                 text : 'SELECT "train_details".dimensions,"train_details".coaches FROM "train_details" JOIN "train_schedule_info" ON "train_schedule_info".train_uid = "train_details".train_uid  WHERE schedule_id = $1',
//                 values : [obj.schedule_id]
//             }

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
//             for(let i = 0 ; i < obj.booked_deatils.length ; i++) {
//                 //update two collumns
//                 const query2 = {
//                     text : 'UPDATE "train_schedule_info" SET seat_details[$1][$2][$3] = $4 WHERE schedule_id = $5',
//                     values : [c_id,dimension[1]*obj.booked_deatils[i][0]+obj.booked_deatils[i][1]+1,3,1,obj.schedule_id]
//                 }
//                 await trainPool.query(query2) ;
//             }
//             await trainPool.query('COMMIT') ;
//             res.status(200).json({message: "Seat Booked"}) ;


//         }catch(err) {
//             await trainPool.query('ROLLBACK') ;
//             console.log(err) ;
//             res.status(500).json({message: "Internal Server Error"}) ;
//         }
//     })

// };

// module.exports = {
//     temporarySeatBooking,
// }