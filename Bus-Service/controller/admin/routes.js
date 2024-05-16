const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const server = require('../../config/busDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');


// console.log(server) ;
const busPool = server.busPool ;
//const trainPool2 = server.trainPool2 ;

dotenv.config();
//token check hobe
const secret = process.env.secret;

function deleteHelper() {

}

// req.body  = [
//     {
//       "start": "Rajshahi",
//       "departure_time": "10:00:00",
//       "cost_class": [
//         100,
//         200,
//         350,
//         375
//       ]
//     },
//     {
//       "start": "NarayanGanj",
//       "departure_time": "11:00:00",
//       "cost_class": [
//         120,
//         220,
//         370,
//         400
//       ]
//     }
// ]


// const addRoutes = async (req, res) => {
//     try{
//         let {error} = await trainPool2.from('routes_table')
//                                           .insert(req.body) 
//         if(error){
//             throw error;
//         }
//         res.status(200).json({message: "Route added"});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }   
// }

// const updateRoutes = async (req, res) => {
//     req.body.id = 1;
//     req.body.routes = [
//         {
//           "start": "Rajshahi",
//           "departure_time": "10:00:00",
//           "cost_class": [
//             100,
//             200,
//             350,
//             375
//           ]
//         },
//         {
//           "start": "NarayanGanj",
//           "departure_time": "11:00:00",
//           "cost_class": [
//             120,
//             220,
//             370,
//             400
//           ]
//         }
//     ]

//     try{
//         let {error} = await trainPool2.from('routes_table')
//                                           .update({routes: req.body.routes}) 
//                                           .eq('id', req.body.id)
//         if(error){
//             throw error;
//         }
//         res.status(200).json({message: "Route updated"});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }   
// };

// const deleteRoutes = async (req, res) => {
//     try{
//         let {error} = await trainPool2.from('routes_table')
//                                           .delete()
//                                           .eq('id', req.body.id)
//         if(error){
//             throw error;
//         }
//         res.status(200).json({message: "Route deleted"});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }   
// }


// //req.params.train_uid = "Lara-62"
// const getRoutes = async (req, res) => {
//     // req.params.train_uid = "Agnibina-735" ;
//     console.log(req.params.train_uid);
//     try{
//         let {data,error} = await trainPool2.from('routes_table')
//                                           .select('routes')
//                                           .eq('train_uid', req.params.train_uid)
//         if(error){
//             throw error;
//         }
//         //routes can be multiple
//         res.status(200).json(data);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }   
// }



// module.exports = {
//     updateRoutes,
//     addRoutes,
//     deleteRoutes,
//     getRoutes

// }


