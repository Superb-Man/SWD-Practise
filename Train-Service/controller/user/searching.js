const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const trainPool = require('../../config/trainDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');
const queryUtils = require('../user/queryUtils.js')

// console.log(queryUtils) ;

dotenv.config();
//token check hobe
const secret = process.env.secret;



async function filter(from,to,date,train_uid = 'None') {
    let query1 = {
        text : 'None',
        values :[]
    }
    if(train_uid == 'None'){
        query1.text = 'SELECT * FROM "train_schedule_info"' ;
        query1.values = []
    }
    else{
        query1.text = 'SELECT * FROM "train_schedule_info" WHERE train_uid = $1' ;
        query1.values = [train_uid] ;
    }

    let results = (await trainPool.query(query1)).rows;
    let res_objs = []
    for(let i = 0;i<results.length;i++){
        let res_obj = {
            train_id : results[i].train_id,
            train_uid : results[i].train_uid,
            schedule_id : results[i].schedule_id,
            routes : [],
            seat_details : results[i].seat_details
        }
        let j = 0 ;
        let routes = [] ;
        for(j = 0;j<results[i].routes.length;j++){
            let x = new Date(results[i].routes[j].date).toLocaleDateString() ;
            let y = new Date(date).toLocaleDateString() ;
            if(results[i].routes[j].start == from && j != results[i].routes.length -1 && x.localeCompare(y) == 0){
                let route = {
                    date : results[i].routes[j].date,
                    departure_time : results[i].routes[j].departure_time,
                    start : results[i].routes[j].start,
                    cost_class : results[i].routes[j].cost_class
                }
                routes.push(route) ;
                j++ ;
                break ;
            }
        }
        let boolean = false ;
        for(;j<results[i].routes.length;j++){
            let route = {
                date : results[i].routes[j].date,
                departure_time : results[i].routes[j].departure_time,
                start : results[i].routes[j].start,
                cost_class : results[i].routes[j].cost_class
            }
            routes.push(route);
            if(results[i].routes[j].start == to && j != 0){
                boolean = true ;
                break ;
            }
        }

        if(boolean == true) {
            res_obj.routes = routes ;
            res_objs.push(res_obj);
        }

    }
    return res_objs ;

}

const gettraininfoByfrom = async (req, res) => {
    try{
        let obj = {from : req.params.from};
        console.log(obj);
        //will handle later
        res.status(200).json(results);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const gettraininfoByto = async (req, res) => {
    try{
        let obj = {to : req.params.to};
        console.log(obj);
        const query1 = {
            text : `SELECT "train_schedule_info".schedule_id,
            "train_schedule_info".train_id,"train_schedule_info".train_uid,
            "train_schedule_info".from_port,"train_schedule_info".to_port,
            "train_schedule_info".date,"train_schedule_info".departure_time,
            "train_schedule_info".routes,
            "train_schedule_info".arrival_date,"train_schedule_info".arrival_time,"train_schedule_info".cost_class,
            "train_services".company_name FROM "train_schedule_info" left join "train_services" on "train_schedule_info".train_id = "train_services".train_id WHERE to_port = $1`,
            values : [obj.to]
        }
        let results = (await trainPool.query(query1)).rows;
        res.status(200).json(results);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const gettraininfoBytrainID = async (req, res) => {
    try{
        let obj = {train_uid : req.params.train_uid};
        console.log(obj);
        const query1 = {
            text : 'SELECT * FROM "train_schedule_info" left join "train_services" on "train_schedule_info".train_id = "train_services".train_id WHERE train_uid = $1',
            values : [obj.train_uid]
        }
        let results = (await trainPool.query(query1)).rows;
        console.log(results) ;
        res.status(200).json(results);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const gettraininfoBytrainCompany = async (req, res) => { 
    try{
        let obj = {train_company_name : req.params.train_company_name};
        console.log(obj);
        const query1 = {
            text : 'SELECT * FROM "train_schedule_info" left join "train_services" on "train_schedule_info".train_id = "train_services".train_id WHERE company_name = $1',
            values : [obj.train_company_name]
        }
        let results = (await trainPool.query(query1)).rows;
        res.status(200).json(results);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    } 
}



async function searchCommon(obj) {
    const query1 = {
        text : 'SELECT coach_id FROM "coach_info" WHERE coach_name = $1',
        values : [obj.coach_name]
    }
    console.log(obj.coach_name) ;
    let coach_id = (await trainPool.query(query1)).rows[0].coach_id;
    console.log(coach_id,"is the coach id");

    return coach_id ;
}


const gettraininfo = async (req, res) => {
   // console.log(req) ;
    try{
        // const obj = {"from" : req.params.from, "to" : req.params.to, "date" : req.params.date , "seat" : req.body.seat, "class" : req.body.class};
        let obj = {from : req.params.from, to : req.params.to, date : req.params.date , seat : req.params.persons, coach_name : req.params.coach,query : req.query.q,low_range : req.query.low_range,up_range : req.query.up_range,hour : req.query.hour,minutes : req.query.minutes};

        console.log(obj);
        let coach_id = await searchCommon(obj) ;    
        //find all from train_schedule_info 
    
        let results = await filter(obj.from,obj.to,obj.date) ;
        let trains = [] ;

        //find the dimensions of each train using query
        for(let i = 0;i<results.length;i++){
            let query3 = {
                text : 'SELECT dimensions,coaches FROM "train_details" WHERE train_id = $1 and train_uid = $2',
                values : [results[i].train_id,results[i].train_uid]
            }
            let dimension = -1 ;
            let coach_idx = -1 ;
            let {dimensions,coaches} = (await trainPool.query(query3)).rows[0] ;
            for(let j = 0 ; j<coaches.length;j++){
                if(coaches[j] == coach_id){
                    coach_idx = j ;
                    dimension = dimensions[j] ;
                    break ;
                }
            }
            if(coach_idx == -1){
                continue ;
            }

            let ans = 0 ;   
            for(let j = 0 ; j<dimensions[coach_idx][2] * dimensions[coach_idx][0]*dimensions[coach_idx][1];j++){
                if(results[i].seat_details[coach_idx][j][2] == 0) {
                    ans+=1;
                }
                if(ans >= obj.seat){
                    let l = results[i].routes.length ;
                    let times = queryUtils.timeDifference(new Date(results[i].routes[0].date),new Date(results[i].routes[l-1].date),results[i].routes[0].departure_time,results[i].routes[l-1].departure_time);
                    let train_result = {
                        schedule_id : results[i].schedule_id,
                        train_id : results[i].train_id,
                        train_uid : results[i].train_uid ,
                        routes : results[i].routes,
                        duration_hour :times.hours,
                        duration_minutes : times.minutes,
                        durations : times.durations,
                        departure_date : new Date(results[i].routes[0].date), 
                        departure_time : results[i].routes[0].time,
                        arrival_date :  new Date(results[i].routes[l-1].date),
                        arrival_time : results[i].routes[l-1].time,
                        cost_class : results[i].routes[l-1].cost_class[coach_idx] -  results[i].routes[0].cost_class[coach_idx] ,
                        coach_name : obj.coach_name,
                        routes : results[i].routes,
                        seat : obj.seat 
                    }
                    trains.push(train_result);
                    break ;
                }
            }
        }


        

        //Query handling

        if(obj.query != undefined && obj.query.localeCompare('quickest') == 0) {
            trains = queryUtils.findQuickesttrain(trains) ;
            // console.log('here') ;
        }
        if(obj.query != undefined && obj.query.localeCompare('shortestroutes') == 0){
            trains = queryUtils.findShortestRoutes(trains) ;
        }

        // if(obj.low_range != undefined && obj.up_range != undefined){
        //     trains = queryUtils.rangeMoney(trains,parseInt(obj.low_range),parseInt(obj.up_range)) ;  
        //     console.log('here') ;     
        // }
        // if(obj.hour != undefined && obj.minutes != undefined){
        //     trains = queryUtils.queryBytime(trains,(obj.hour*60+obj.minutes)*60) ;
        // }

        if(trains.length == 0){
            res.status(404).json({message: "No trains found"});
            return ;
        }

        res.status(200).json(trains); 


    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};


//still doesnot need verification
const getSeatAvailableByspecifictrain = async (req, res) => {
    try{
        let obj = {from : req.params.from, to : req.params.to, date : req.params.date , seat : req.params.persons, coach_name : req.params.coach,train_uid : req.params.train_uid};
        console.log(obj);
        let coach_id = await searchCommon(obj) ;
    
    
        //find all from train_schedule_info 
    
        let results = await filter(obj.from,obj.to,obj.date) ;
        console.log(results) ;

        let query3 = {
            text : 'SELECT dimensions,coaches FROM "train_details" WHERE train_uid = $1',
            values : [results[0].train_uid]
        }
        let dimension = -1 ;
        let coach_idx = -1 ;
        let {dimensions,coaches} = (await trainPool.query(query3)).rows[0] ;
        for(let j = 0 ; j<coaches.length;j++){
            if(coaches[j] == coach_id){
                coach_idx = j ;
                dimension = dimensions[j] ;
                break ;
            }
        }
        let l = results[0].routes.length ;
        let times = queryUtils.timeDifference(new Date(results[0].routes[0].date),new Date(results[0].routes[l-1].date),results[0].routes[0].departure_time,results[0].routes[l-1].departure_time);
        let train_result = {
            schedule_id : results[0].schedule_id,
            train_id : results[0].train_id,
            train_uid : results[0].train_uid ,
            routes : results[0].routes,
            duration_hour :times.hours,
            duration_minutes : times.minutes,
            durations : times.durations,
            departure_date : new Date(results[0].routes[0].date), 
            departure_time : results[0].routes[0].time,
            arrival_date :  new Date(results[0].routes[l-1].date),
            arrival_time : results[0].routes[l-1].time,
            cost_class : results[0].routes[l-1].cost_class[coach_idx] - results[0].routes[0].cost_class[coach_idx] ,
            coach_name : obj.coach_name,
            routes : results[0].routes,
            seat : obj.seat ,
            dimension: dimensions[coach_idx], //compart_Ment,col,row
            seat_details : results[0].seat_details[coach_idx], //for each =========>[row,col,status,compartment]
            routes : results[0].routes,
            seat : obj.seat 
        }
            // }
        // }

        res.status(200).json(train_result);

    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// const seatAvailable()



module.exports = { gettraininfo,
                    gettraininfoByfrom,
                    gettraininfoByto,
                    gettraininfoBytrainID,
                    getSeatAvailableByspecifictrain,
                    gettraininfoBytrainCompany,
                };    