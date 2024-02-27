const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const server = require('../../config/busDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');


// console.log(server) ;
const busPool = server.busPool ;
// const trainPool2 = server.trainPool2 ;

// const secret = process.env.secret;

// async function getTrainByUid(train_uid){
//     try{
//         const {data,error} = await trainPool2
//                             .from('train_details')
//                             .select('*')
//                             .eq('train_uid',train_uid)
//         if(error){
//             throw error;
//         }
//         return data ;
//     }catch(err){
//         console.log(err);
//         return false ;
//     }   
// }

// async function getTrainCompany(company_name){
//     try{
//         const {data,error} = await trainPool2
//                             .from('train_services')
//                             .select('*')
//                             .eq('company_name',company_name)
//         if(error){
//             throw error;
//         }
//         return data ;
//     }catch(err){
//         console.log(err);
//     }   
// }

// async function getAllCoaches(train_uid){
//     try{
//         console.log(train_uid);
//         let {data,error} = await trainPool2
//                             .from('train_details')
//                             .select('dimensions,coaches')
//                             .eq('train_uid',train_uid) ;
//         if(error){
//             throw error;
//         }
//         data = data[0] ;
//         // console.log(data) ;
//         let results = {
//             coaches : [],
//             dimensions : data.dimensions
//         }
//         for(let i = 0 ; i < data.coaches.length ; i++){
//             // console.log(data.coaches[i]);   
//             // let {data2,error2} = await trainPool2
//             //                 .from('coach_info')
//             //                 .select('coach_id')
//             //                 .eq('coach_id',data.coaches[i]) ;
//             //write SQL 
//             const query1 = {   
//                 text : 'SELECT "coach_name" FROM "coach_info" WHERE "coach_id" = $1',
//                 values : [data.coaches[i]]
//             }
//             const data2 = (await trainPool.query(query1)).rows[0] ;
//             // console.log(data2);
//             // if(error2){
//             //     throw error2;
//             // }
//             results.coaches.push(data2.coach_name);
//         }
//         return results ;
//     }catch(err){
//         console.log(err);
//     }

// }

// async function findIndexofCoach(train_uid,coach_name){
//     try{
//         const {data,error} = await trainPool2
//                             .from('coach_info')
//                             .select('coach_id')
//                             .eq('coach_name',coach_name)
//         if(error){
//             throw error;
//         }
//         data = data[0] ;
//         const {data2,error2} = await trainPool2
//                             .from('train_details')
//                             .select('coaches,dimensions')
//                             .eq('train_uid',train_uid)
//         if(error2){
//             throw error2;
//         }
//         data2 = data2[0] ;
//         let obj = {
//             dimensions : [] ,
//             idx : -1
//         }
//         for(let i = 0 ; i < data2.coaches.length ; i++){
//             if(data2.coaches[i] == data.coach_id){
//                 //0 index
//                 obj.idx = i ;
//                 obj.dimensions = data2.dimensions[i];
//                 return obj ;
//             }
//         }
//         return  obj ;
//     }catch(err){
//         console.log(err);
//     }

// }


// // req.body = {
// //     compnay_name : "Aginibina EXpress"

// // }
// const addTrainCompany = async(req,res)=>{
//     try{
//         req.body = {
//             company_name : "Toriqe Express;"

//         }
//         //checking if same train company added
//         if(await getTrainCompany(req.body.company_name).length == 0){
//             res.status(400).json({message: "Train company already exists"});
//             return;
//         }
//         let {error} = await trainPool2
//                             .from('train_services')
//                             .insert([req.body])
//         if(error){
//             throw error;
//         }
//         res.status(200).json({message: "Train company added"});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }   

// }


// // req.body = {
// //     train_uid: "Lara-62",
// //     train_id : 1 
// // }
// const addTrain = async(req,res)=>{
//     try{
//         req.body = {
//             train_uid: "Lara-104",
//             train_id : 1 
//         }
//         //cheking if same train added
//         if(await getTrainByUid(req.body.train_uid).length == 0){
//             res.status(400).json({message: "Train already exists"});
//             return;
//         }
//         let {error} = await trainPool2
//                             .from('train_details')
//                             .insert([req.body])
//         if(error){
//             throw error;
//         }
//         res.status(200).json({message: "Train added"});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }   

// } ;


// // req.body = {
// //     coaches : [1,2,3,4],
// //     dimensions : [[2,3,2],[2,3,2],[2,3,2],[2,3,2]],
// // }
// const addDetails = async(req,res)=>{
//     req.body = {
//         train_uid: "Lara-104",
//         coaches : [1,2,3],
//         dimensions : [[2,3,2],[2,3,2],[2,3,2]],
//     }
//     try{
//         let {error} = await trainPool2
//                             .from('train_details')
//                             .update({coaches : req.body.coaches, dimensions : req.body.dimensions})
//                             .eq('train_uid', req.body.train_uid)
//         if(error){
//             throw error;
//         }
//         res.status(200).json({message: "Train details added"});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }   
// };

// const getAllTrainsByCompanyName = async(req,res)=>{
//     try{
//         //join with train_details to on train_id to get train_uid
//         // req.params.company_name = "Agnibina Express";
//         const query1 = {
//             text : 'SELECT "train_details".train_uid , "train_details".train_id FROM "train_details" JOIN "train_services" ON "train_details".train_id = "train_services".train_id WHERE "train_services".company_name = $1',
//             values : [req.params.company_name]
//         }
//         const data = (await trainPool.query(query1)).rows ;
//         res.status(200).json(data);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// };

// // req.params.train_uid = "Lara-62";
// // req.params.coach = 'SHOVAN'
// const showGrid = async(req,res)=>{
//     req.params.train_uid = "Lara-62";
//     req.params.coach = 'SHOVAN'
//     try{
//         let obj = await findIndexofCoach(req.params.train_uid,req.params.coach);
//         if(obj.idx == -1){
//             res.status(400).json({message: "Coach does not exist"});
//             return;
//         }
        

//         res.status(200).json(data);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// }

// const getAllCoachesDetails = async(req,res)=>{
//     try{
//         const data = await getAllCoaches(req.params.train_uid) ;
//         res.status(200).json(data);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// };

// module.exports = {
//     addTrain,
//     addTrainCompany,
//     addDetails,
//     getAllTrainsByCompanyName,
//     getAllCoaches,
//     getAllCoachesDetails,
//     findIndexofCoach

// }