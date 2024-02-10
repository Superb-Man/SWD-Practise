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

async function filter(from,to,date) {
    const query2 = {
        text : 'SELECT * FROM "train_schedule_info"',
        values : []
    }
    let result2 = (await trainPool.query(query1)).rows;
    console.log(results);
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
            console.log(results[i].routes[j].date,obj.date) ;
            if(results[i].routes[j].start == obj.from && j != results[i].routes.length -1 && results[i].routes[j].date == obj.date){
                let route = {
                    date : results[i].routes[j].date.toLocaleDateString(),
                    departure_time : results[i].routes[j].time,
                    start : results[i].routes[j].start
                }
                routes.push(route) ;
                j++ ;
                break ;
            }
        }
        let boolean = false ;
        for(;j<results[i].routes.length;j++){
            let route = {
                date : results[i].routes[j].date.toLocaleDateString(),
                departure_time : results[i].routes[j].time,
                start : results[i].routes[j].start
            }
            routes.push(route);
            if(results[i].routes[j].start == obj.to && j != 0){
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
            "train_schedule_info".departure_date,"train_schedule_info".departure_time,
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

const gettraininfoByFlightID = async (req, res) => {
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
        values : [obj.class_name]
    }
    let class_id = (await trainPool.query(query1)).rows[0].class_id;

    return class_id ;
}


const gettraininfo = async (req, res) => {
   // console.log(req) ;
    try{
        // const obj = {"from" : req.params.from, "to" : req.params.to, "date" : req.params.date , "seat" : req.body.seat, "class" : req.body.class};
        let obj = {from : req.params.from, to : req.params.to, date : req.params.date , seat : req.params.persons, coach_name : req.params.coach,query : req.query.q,low_range : req.query.low_range,up_range : req.query.up_range,hour : req.query.hour,minutes : req.query.minutes};

        console.log(obj);
        let coach_id = await searchCommon(obj) ;    
        //find all from train_schedule_info 
    
        let results = filter(obj.from,obj.to,obj.date,class_id) ;
        console.log(results);
        let flights = [] ;

        //find the dimensions of each flight using query
        for(let i = 0;i<results.length;i++){
            let query3 = {
                text : 'SELECT dimensions,coaches FROM "train_details" WHERE train_id = $1 and train_uid = $2',
                values : [results[0].train_id,results[0].train_uid]
            }
            let dimension = -1 ;
            let {dimensions,coaches} = (await trainPool.query(query3)).rows[0] ;
            for(let j = 0 ; j<coaches.length;j++){
                if(coaches[j] == coach_id){
                    coach_id = j ;
                    dimension = dimensions[j] ;
                    break ;
                }
            }
            // console.log(dimensions.length);
    
            //reading if the seat is available or not
            let ans = 0 ;   
            for(let j = 0 ; j<dimensions[class_id][2] * dimensions[coach_id][0];j++){
                if(results[i].seat_details[class_id][j][2] == 0) {
                    ans+=1;
                }
                if(ans>=obj.seat){
                    let times = queryUtils.timeDifference(results[i].departure_date,results[i].arrival_date,results[i].departure_time,results[i].arrival_time);
                    let flight_result = {
                        schedule_id : results[i].schedule_id,
                        train_id : results[i].train_id,
                        train_uid : results[i].train_uid ,
                        from_port : obj.from,
                        to_Port : obj.to,
                        duration_hour :times.hours,
                        duration_minutes : times.minutes,
                        durations : times.durations,
                        departure_date : results[i].departure_date.toLocaleDateString(), 
                        departure_time : results[i].departure_time,
                        arrival_date :  results[i].arrival_date.toLocaleDateString(),
                        arrival_time : results[i].arrival_time,
                        cost_class : results[i].cost_class[class_id],
                        class_name : obj.class_name,
                        train_company_name : results[i].company_name,
                        routes : results[i].routes,
                        dimensions : dimensions[class_id], //row-column
                        // seat_details : results[i].seat_details[class_id],
                        seat : obj.seat 
                    }
                    flights.push(flight_result);
                    break ;
                }
            }
        }


        

        //Query handling


        if(obj.query != undefined && obj.query.localeCompare('early_takeoff') == 0) {
            flights = queryUtils.earlyDeparture(flights) ;
        }
        if(obj.query != undefined && obj.query.localeCompare('quickest') == 0) {
            flights = queryUtils.findQuickestFlight(flights) ;
            // console.log('here') ;
        }

        if(obj.query != undefined && obj.query.localeCompare('cheapest') == 0) {
            queryUtils.findCheapestFlight(flights) ;
        }

        if(obj.low_range != undefined && obj.up_range != undefined){
            flights = queryUtils.rangeMoney(flights,parseInt(obj.low_range),parseInt(obj.up_range)) ;  
            console.log('here') ;     
        }
        if(obj.hour != undefined && obj.minutes != undefined){
            flights = queryUtils.queryBytime(flights,(obj.hour*60+obj.minutes)*60) ;
        }

        if(flights.length == 0){
            res.status(404).json({message: "No flights found"});
            return ;
        }

        res.status(200).json(flights); 


    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};


//still doesnot need verification
const getSeatAvailableByspecificFlight = async (req, res) => {
    try{
        let obj = {from : req.params.from, to : req.params.to, date : req.params.date , seat : req.params.persons, class_name : req.params.class,train_uid : req.params.train_uid};
        console.log(obj);
        let class_id = await searchCommon(obj) ;
    
    
        //find all from train_schedule_info 
        const query2 = {
            text : 'SELECT * FROM "train_schedule_info" left join "train_services"on "train_schedule_info".train_id = "train_services".train_id WHERE from_port = $1 and to_port = $2 and departure_date = $3 and train_uid = $4',
            values : [obj.from,obj.to,obj.date,obj.train_uid]
        }
    
        let results = (await trainPool.query(query2)).rows;

        let query3 = {
            text : 'SELECT dimensions,classes FROM "train_details" WHERE train_id = $1 and train_uid = $2',
            values : [results[0].train_id,results[0].train_uid]
        }
        let dimension = -1 ;
        let {dimensions,classes} = (await trainPool.query(query3)).rows[0] ;
        for(let j = 0 ; j<classes.length;j++){
            if(classes[j] == class_id){
                class_id = j ;
                dimension = dimensions[j] ;
                break ;
            }
        }
        let ans = 0 ;
        // this loop is not mandatory. Still for safety, checking again   
        // for(let j = 0 ; j<dimensions[class_id][0] * dimensions[class_id][1];j++){
        //     if(results[i].seat_details[class_id][j][2] == 0) {
        //         ans+=1;
        //     }
        //     if(ans>=obj.seat){
            let times = queryUtils.timeDifference(results[0].departure_date,results[0].arrival_date,results[0].departure_time,results[0].arrival_time);
                let flight_result = {
                    schedule_id : results[0].schedule_id,
                    train_uid : results[0].train_uid ,
                    from_Port : obj.from,
                    to_Port : obj.to,
                    duration_hour :times.hours,
                    duration_minutes : times.minutes,
                    departure_date : results[0].departure_date.toLocaleDateString(), 
                    departure_time : results[0].departure_time,
                    arrival_date :  results[0].arrival_date.toLocaleDateString(),
                    arrival_time : results[0].arrival_time,
                    cost_class : results[0].cost_class[class_id],
                    class_name : obj.class_name,
                    dimension: dimensions[class_id], //row-column
                    train_company_name : results[0].company_name,
                    seat_details : results[0].seat_details[class_id],
                    routes : results[0].routes,
                    seat : obj.seat 
                }
            // }
        // }

        res.status(200).json(flight_result);

    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// const seatAvailable()



module.exports = { gettraininfo,
                    gettraininfoByfrom,
                    gettraininfoByto,
                    gettraininfoByFlightID,
                    getSeatAvailableByspecificFlight,
                    gettraininfoBytrainCompany,
                };    