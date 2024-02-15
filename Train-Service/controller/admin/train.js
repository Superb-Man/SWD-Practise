const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const server = require('../../config/trainDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');


// console.log(server) ;
const trainPool = server.trainPool ;
const trainPool2 = server.trainPool2 ;

const secret = process.env.secret;

async function getTrainByUid(train_uid){
    try{
        const {data,error} = await trainPool2
                            .from('train_details')
                            .select('*')
                            .eq('train_uid',train_uid)
        if(error){
            throw error;
        }
        if (data.length === 0){
            return false ;
        }

        return true ;
    }catch(err){
        console.log(err);
        return false ;
    }   
}

async function getTrainCompany(company_name){
    try{
        const {data,error} = await trainPool2
                            .from('train_services')
                            .select('*')
                            .eq('company_name',company_name)
        if(error){
            throw error;
        }
        if (data.length === 0){
            return false ;
        }
        return true ;
    }catch(err){
        console.log(err);
    }   
}


// req.body = {
//     compnay_name : "Aginibina EXpress"

// }
const addTrainCompany = async(req,res)=>{
    try{
        req.body = {
            company_name : "Toriqe Express;"

        }
        //checking if same train company added
        if(await getTrainCompany(req.body.company_name)){
            res.status(400).json({message: "Train company already exists"});
            return;
        }
        let {error} = await trainPool2
                            .from('train_services')
                            .insert([req.body])
        if(error){
            throw error;
        }
        res.status(200).json({message: "Train company added"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }   

}


// req.body = {
//     train_uid: "Lara-62",
//     train_id : 1 
// }
const addTrain = async(req,res)=>{
    try{
        req.body = {
            train_uid: "Lara-62",
            train_id : 1 
        }
        //cheking if same train added
        if(await getTrainByUid(req.body.train_uid)){
            res.status(400).json({message: "Train already exists"});
            return;
        }
        let {error} = await trainPool2
                            .from('train_details')
                            .insert([req.body])
        if(error){
            throw error;
        }
        res.status(200).json({message: "Train added"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }   

} ;


// req.body = {
//     coaches : [1,2,3,4],
//     dimensions : [[2,3,2],[2,3,2],[2,3,2],[2,3,2]],
// }
const addDetails = async(req,res)=>{
    req.body = {
        train_uid: "Lara-62",
        coaches : [1,2,3,4],
        dimensions : [[2,3,2],[2,3,2],[2,3,2],[2,3,2]],
    }
    try{
        let {error} = await trainPool2
                            .from('train_details')
                            .update({coaches : req.body.coaches, dimensions : req.body.dimensions})
                            .eq('train_uid', req.body.train_uid)
        if(error){
            throw error;
        }
        res.status(200).json({message: "Train details added"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }   
};

module.exports = {
    addTrain,
    addTrainCompany,
    addDetails
}