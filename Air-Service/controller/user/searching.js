const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const airPool = require('../../config/airDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');
const queryUtils = require('../user/queryUtils.js')

// console.log(queryUtils) ;

dotenv.config();
//token check hobe
const secret = process.env.secret;



const getairinfoByfrom = async (req, res) => {
    try{
        let obj = {from : req.params.from};
        console.log(obj);
        //will handle later

        const query1 = {
            text : `SELECT "air_schedule_info".schedule_id,
            "air_schedule_info".air_id,"air_schedule_info".flight_id,
            "air_schedule_info".from_port,"air_schedule_info".to_port,
            "air_schedule_info".departure_date,"air_schedule_info".departure_time,
            "air_schedule_info".transits,
            "air_schedule_info".arrival_date,"air_schedule_info".arrival_time,"air_schedule_info".cost_class,
            "air_services".company_name FROM "air_schedule_info" left join "air_services" on "air_schedule_info".air_id = "air_services".air_id WHERE from_port = $1`,
            values : [obj.from]
        }
        let results = (await airPool.query(query1)).rows;

        // const query1 = {
        //     text : 'SELECT * FROM "air_schedule_info"',
        //     values : []
        // }
        // let results = (await airPool.query(query1)).rows;
        // console.log(results);
        // let res_objs = []
        // for(let i = 0;i<results.length;i++){
        //     let res_obj = {
        //         air_id : results[i].air_id,
        //         flight_id: results[i].flight_id,
        //         schedule_id : results[i].schedule_id,
        //         transits : []
        //     }
        //     let j = 0 ;
        //     let transits = [] ;
        //     for(j = 0;j<results[i].transits.length;j++){
        //         if(results[i].transits[j].port == obj.from){
        //             let transit = {
        //                 date : new Date(results[i].transits[j].date),
        //                 time : results[i].transits[j].time,
        //                 port : results[i].transits[j].port
        //             }
        //             transits.push(transit) ;
        //             j++ ;
        //             break ;
        //         }
        //     }
        //     for(;j<results[i].transits.length;j++){
        //         let transit = {
        //             date : new Date(results[i].transits[j].date),
        //             time : results[i].transits[j].time,
        //             port : results[i].transits[j].port
        //         }
        //         transits.push(transit);
        //     }

        //     if(transits.length > 1) {
        //         res_obj.trasits = transits ;
        //         res_objs.push(res_obj);
        //     }

        // }
        res.status(200).json(results);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getairinfoByto = async (req, res) => {
    try{
        let obj = {to : req.params.to};
        console.log(obj);
        const query1 = {
            text : `SELECT "air_schedule_info".schedule_id,
            "air_schedule_info".air_id,"air_schedule_info".flight_id,
            "air_schedule_info".from_port,"air_schedule_info".to_port,
            "air_schedule_info".departure_date,"air_schedule_info".departure_time,
            "air_schedule_info".transits,
            "air_schedule_info".arrival_date,"air_schedule_info".arrival_time,"air_schedule_info".cost_class,
            "air_services".company_name FROM "air_schedule_info" left join "air_services" on "air_schedule_info".air_id = "air_services".air_id WHERE to_port = $1`,
            values : [obj.to]
        }
        let results = (await airPool.query(query1)).rows;
        res.status(200).json(results);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getairinfoByFlightID = async (req, res) => {
    try{
        let obj = {flight_id : req.params.flight_id};
        console.log(obj);
        const query1 = {
            text : 'SELECT * FROM "air_schedule_info" left join "air_services" on "air_schedule_info".air_id = "air_services".air_id WHERE flight_id = $1',
            values : [obj.flight_id]
        }
        let results = (await airPool.query(query1)).rows;
        console.log(results) ;
        res.status(200).json(results);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getairinfoByAirCompany = async (req, res) => { 
    try{
        let obj = {air_company_name : req.params.air_company_name};
        console.log(obj);
        const query1 = {
            text : 'SELECT * FROM "air_schedule_info" left join "air_services" on "air_schedule_info".air_id = "air_services".air_id WHERE company_name = $1',
            values : [obj.air_company_name]
        }
        let results = (await airPool.query(query1)).rows;
        res.status(200).json(results);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    } 
}



async function searchCommon(obj) {
    const query1 = {
        text : 'SELECT class_id FROM "class_info" WHERE class_name = $1',
        values : [obj.class_name]
    }
    let class_id = (await airPool.query(query1)).rows[0].class_id;

    return class_id ;
}


const getairinfo = async (req, res) => {
   // console.log(req) ;
    try{
        // const obj = {"from" : req.params.from, "to" : req.params.to, "date" : req.params.date , "seat" : req.body.seat, "class" : req.body.class};
        let obj = {from : req.params.from, to : req.params.to, date : req.params.date , seat : req.params.persons, class_name : req.params.class,query : req.query.q,low_range : req.query.low_range,up_range : req.query.up_range,hour : req.query.hour,minutes : req.query.minutes};

        console.log(obj);
        let class_id = await searchCommon(obj) ;    
        //find all from air_schedule_info 
        const query2 = {
            text : 'SELECT * FROM "air_schedule_info" left join "air_services"on "air_schedule_info".air_id = "air_services".air_id WHERE from_port = $1 and to_port = $2 and departure_date = $3',
            values : [obj.from,obj.to,obj.date]
        }
    
        let results = (await airPool.query(query2)).rows;
        console.log(results);
        let flights = [] ;

        //find the dimensions of each flight using query
        for(let i = 0;i<results.length;i++){
            let query3 = {
                text : 'SELECT dimensions,classes FROM "air_details" WHERE air_id = $1 and flight_id = $2',
                values : [results[0].air_id,results[0].flight_id]
            }
            let dimension = -1 ;
            let class_idx = -1 ;
            let {dimensions,classes} = (await airPool.query(query3)).rows[0] ;
            for(let j = 0 ; j<classes.length;j++){
                if(classes[j] == class_id){
                    class_idx = j ;
                    dimension = dimensions[j] ;
                    break ;
                }
            }
            if(class_idx == -1) {
                continue ;
            }
            // console.log(dimensions.length);
    
            //reading if the seat is available or not
            let ans = 0 ;   
            for(let j = 0 ; j<dimensions[class_idx][0] * dimensions[class_idx][1];j++){
                if(results[i].seat_details[class_idx][j][2] == 0) {
                    ans+=1;
                }
                if(ans>=obj.seat){
                    let times = queryUtils.timeDifference(results[i].departure_date,results[i].arrival_date,results[i].departure_time,results[i].arrival_time);
                    let flight_result = {
                        schedule_id : results[i].schedule_id,
                        air_id : results[i].air_id,
                        flight_id : results[i].flight_id ,
                        from_Port : obj.from,
                        to_Port : obj.to,
                        duration_hour :times.hours,
                        duration_minutes : times.minutes,
                        durations : times.durations,
                        departure_date : results[i].departure_date.toLocaleDateString(), 
                        departure_time : results[i].departure_time,
                        arrival_date :  results[i].arrival_date.toLocaleDateString(),
                        arrival_time : results[i].arrival_time,
                        cost_class : results[i].cost_class[class_idx],
                        class_name : obj.class_name,
                        air_company_name : results[i].company_name,
                        transits : results[i].transits,
                        dimensions : dimensions[class_idx], //row-column
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
        let obj = {from : req.params.from, to : req.params.to, date : req.params.date , seat : req.params.persons, class_name : req.params.class,flight_id : req.params.flight_id};
        console.log(obj);
        let class_id = await searchCommon(obj) ;
    
    
        //find all from air_schedule_info 
        const query2 = {
            text : 'SELECT * FROM "air_schedule_info" left join "air_services"on "air_schedule_info".air_id = "air_services".air_id WHERE from_port = $1 and to_port = $2 and departure_date = $3 and flight_id = $4',
            values : [obj.from,obj.to,obj.date,obj.flight_id]
        }
    
        let results = (await airPool.query(query2)).rows;

        let query3 = {
            text : 'SELECT dimensions,classes FROM "air_details" WHERE air_id = $1 and flight_id = $2',
            values : [results[0].air_id,results[0].flight_id]
        }
        let dimension = -1 ;
        let class_idx = -1 ;
        let {dimensions,classes} = (await airPool.query(query3)).rows[0] ;
        for(let j = 0 ; j<classes.length;j++){
            if(classes[j] == class_id){
                class_idx = j ;
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
                    flight_id : results[0].flight_id ,
                    from_Port : obj.from,
                    to_Port : obj.to,
                    duration_hour :times.hours,
                    duration_minutes : times.minutes,
                    departure_date : results[0].departure_date.toLocaleDateString(), 
                    departure_time : results[0].departure_time,
                    arrival_date :  results[0].arrival_date.toLocaleDateString(),
                    arrival_time : results[0].arrival_time,
                    cost_class : results[0].cost_class[class_idx],
                    class_name : obj.class_name,
                    dimension: dimensions[class_idx], //row-column
                    air_company_name : results[0].company_name,
                    seat_details : results[0].seat_details[class_idx],
                    transits : results[0].transits,
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



module.exports = { getairinfo,
                    getairinfoByfrom,
                    getairinfoByto,
                    getairinfoByFlightID,
                    getSeatAvailableByspecificFlight,
                    getairinfoByAirCompany,
                };    