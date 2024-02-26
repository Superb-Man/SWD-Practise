const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../../config/accountDB.js');
const server = require('../../config/busDB.js');
const crypto = require('../../utils.js');
const { query } = require('express');
const queryUtils = require('../user/queryUtils.js')

// console.log(queryUtils) ;

dotenv.config();
//token check hobe
const secret = process.env.secret;
const busPool = server.busPool ;


// //post
// const getAllroutesDetailsByTrainUid = async(req,res)  => {
//     //let {train_uid, schedule_id} = req.body ;

//     let train_uid ='Agnibina-735' ;
//     let schedule_id = 2 ;
//     try{
    
//         let query1 = { 

//             text : 'SELECT train_uid , routes FROM "train_schedule_info" WHERE train_uid = $1 AND schedule_id = $2',
//             values : [ train_uid, schedule_id ]

//         }

    
        
//         let results = (await trainPool.query(query1)).rows;

//         res.status(200).json(results) ;

//     }

//     catch(err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
        

//     }



// }

async function filter(from,to,date,category,bus_company = []) {

    let results = []
    let query1 = {
        text : 'None',
        values :[]
    }
    if(bus_company.length == 0){

        query1.text = 'SELECT * FROM "bus_schedule_info" LEFT JOIN "bus_services" ON "bus_schedule_info".bus_id = "bus_services".bus_id LEFT JOIN "bus_details" ON "bus_schedule_info".bus_name = "bus_details".bus_name WHERE source = $1 AND destination = $2 AND departure_date = $3 AND "bus_details".category = $4'
        query1.values = [from, to, date, category]

        let result = (await busPool.query(query1)).rows;
        results.push(result)
        

        console.log("Single")
        
    }
    else{

    

        for(let i=0; i < bus_company.length ; i++){

            query1.text = 'SELECT * FROM "bus_schedule_info" LEFT JOIN "bus_services" ON "bus_schedule_info".bus_id = "bus_services".bus_id LEFT JOIN "bus_details" ON "bus_schedule_info".bus_name = "bus_details".bus_name WHERE "bus_services".bus_company = $1 AND source = $2 AND destination = $3 AND departure_date = $4 AND "bus_details".category = $5' ;
            query1.values = [bus_company[i], from, to, date, category] ;
            let result = (await busPool.query(query1)).rows;
            if( i != 0 ) results[0].push(...result)
            else results.push(result)

        }

        

        console.log("Batch")
        
    }

     
    
    return results[0] ;

}

async function filterbyBus(from,to,date,category,bus_name) {

    let results = []
    let query1 = {
        text : 'None',
        values :[]
    }
    

    query1.text = 'SELECT * FROM "bus_schedule_info" LEFT JOIN "bus_services" ON "bus_schedule_info".bus_id = "bus_services".bus_id LEFT JOIN "bus_details" ON "bus_schedule_info".bus_name = "bus_details".bus_name WHERE source = $1 AND destination = $2 AND departure_date = $3 AND "bus_details".category = $4 AND "bus_details".bus_name = $5'
    query1.values = [from, to, date, category, bus_name]

    let result = (await busPool.query(query1)).rows;
    results.push(result)
        

    console.log("Single")
        
    
    

     
    
    return results[0] ;

}


// const gettraininfoByfrom = async (req, res) => {
//     try{
//         let obj = {from : req.params.from};
//         console.log(obj);
//         //will handle later
//         res.status(200).json(results);
//     }catch (err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// };

// const gettraininfoByto = async (req, res) => {
//     try{
//         let obj = {to : req.params.to};
//         console.log(obj);
//         const query1 = {
//             text : `SELECT "train_schedule_info".schedule_id,
//             "train_schedule_info".train_id,"train_schedule_info".train_uid,
//             "train_schedule_info".from_port,"train_schedule_info".to_port,
//             "train_schedule_info".date,"train_schedule_info".departure_time,
//             "train_schedule_info".routes,
//             "train_schedule_info".arrival_date,"train_schedule_info".arrival_time,"train_schedule_info".cost_class,
//             "train_services".company_name FROM "train_schedule_info" left join "train_services" on "train_schedule_info".train_id = "train_services".train_id WHERE to_port = $1`,
//             values : [obj.to]
//         }
//         let results = (await trainPool.query(query1)).rows;
//         res.status(200).json(results);
//     }catch (err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// };

// const gettraininfoBytrainID = async (req, res) => {
//     try{
//         let obj = {train_uid : req.params.train_uid};
//         console.log(obj);
//         const query1 = {
//             text : 'SELECT * FROM "train_schedule_info" left join "train_services" on "train_schedule_info".train_id = "train_services".train_id WHERE train_uid = $1',
//             values : [obj.train_uid]
//         }
//         let results = (await trainPool.query(query1)).rows;
//         console.log(results) ;
//         res.status(200).json(results);
//     }catch (err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// };

// const gettraininfoBytrainCompany = async (req, res) => { 
//     try{
//         let obj = {train_company_name : req.params.train_company_name};
//         console.log(obj);
//         const query1 = {
//             text : 'SELECT * FROM "train_schedule_info" left join "train_services" on "train_schedule_info".train_id = "train_services".train_id WHERE company_name = $1',
//             values : [obj.train_company_name]
//         }
//         let results = (await trainPool.query(query1)).rows;
//         res.status(200).json(results);
//     }catch (err){
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     } 
// }



// async function searchCommon(obj) {
//     const query1 = {
//         text : 'SELECT coach_id FROM "coach_info" WHERE coach_name = $1',
//         values : [obj.coach_name]
//     }
//     console.log(obj.coach_name) ;
//     let coach_id = (await trainPool.query(query1)).rows[0].coach_id;
//     console.log(coach_id,"is the coach id");

//     return coach_id ;
// }


const getbusinfo = async (req, res) => {
//    // console.log(req) ;
     try{
//         // const obj = {"from" : req.params.from, "to" : req.params.to, "date" : req.params.date , "seat" : req.body.seat, "class" : req.body.class};
         //FALGUNI PARIBAHAN

         console.log(req.body.selected_route_companies)

        let obj = {from : req.params.from, to : req.params.to, date : req.params.date, category : req.params.category, query : req.query.q, selected_route_companies : req.body.selected_route_companies};
        
        

         console.log(obj);
//         let coach_id = await searchCommon(obj) ;    
//         //find all from train_schedule_info 
    
        let results = await filter(obj.from, obj.to, obj.date, obj.category) ;

        const route_companies = [...new Set(results.map(item => item.bus_company))];

        //if( obj.selected_route_companies.length != 0)

        

        results = await filter(obj.from, obj.to, obj.date, obj.category, obj.selected_route_companies) ;
        

        let buslist = []

       // console.log(results)

        for(let i=0 ; i< results.length ;i++){

            let availableSeats = 0;

            for(let j = 0 ; j<results[i].seat_details.length;j++){

                if(results[i].seat_details[j][2] == 0) {
    
                    availableSeats = availableSeats + 1;
    
                }
    
            }

            let bus_result = {

                schedule_id : results[i].schedule_id,
                bus_id : results[i].bus_id,
                bus_name : results[i].bus_name ,
                bus_company : results[i].bus_company,
                boarding : results[i].boarding,
                dropping : results[i].dropping,
                
                departure_date : new Date(results[i].departure_date), 
                category : results[i].category,
                
                cost : results[i].cost ,

                source : results[i].source,
                destination : results[i].destination,

                start : results[i].start,
                stop : results[i].stop,

                departure_time : results[i].departure_time,
                arrival_time : results[i].arrival_time,


                availableSeats : availableSeats
                             
            }

            buslist.push(bus_result)

        }

        
        
//        res.status(200).json(results)
//         let trains = [] ;

//         //find the dimensions of each train using query
//         for(let i = 0;i<results.length;i++){
//             let query3 = {
//                 text : 'SELECT dimensions,coaches FROM "train_details" WHERE train_id = $1 and train_uid = $2',
//                 values : [results[i].train_id,results[i].train_uid]
//             }
//             let dimension = -1 ;
//             let coach_idx = -1 ;
//             let {dimensions,coaches} = (await trainPool.query(query3)).rows[0] ;
//             for(let j = 0 ; j<coaches.length;j++){
//                 if(coaches[j] == coach_id){
//                     coach_idx = j ;
//                     dimension = dimensions[j] ;
//                     break ;
//                 }
//             }
//             if(coach_idx == -1){
//                 continue ;
//             }

//             let ans = 0 ;   
//             for(let j = 0 ; j<dimensions[coach_idx][2] * dimensions[coach_idx][0]*dimensions[coach_idx][1];j++){
//                 if(results[i].seat_details[coach_idx][j][2] == 0) {
//                     ans+=1;
//                 }
//                 if(ans >= obj.seat){
//                     let l = results[i].routes.length ;
//                     let times = queryUtils.timeDifference(new Date(results[i].routes[0].date),new Date(results[i].routes[l-1].date),results[i].routes[0].departure_time,results[i].routes[l-1].departure_time);
//                     let train_result = {
                        
//                     }
//                     trains.push(train_result);
//                     break ;
//                 }
//             }
//         }


        

//         //Query handling

            if(obj.query != undefined && obj.query.localeCompare('early_departure') == 0) {
                buslist = queryUtils.earlyDeparture(buslist) ;
            }

            if(obj.query != undefined && obj.query.localeCompare('seats_available') == 0) {
                buslist = queryUtils.availSeat(buslist) ;
            }

            if(obj.query != undefined && obj.query.localeCompare('cheapest') == 0) {
                buslist = queryUtils.findCheapestBus(buslist) ;
            }

//         if(obj.query != undefined && obj.query.localeCompare('quickest') == 0) {
//             trains = queryUtils.findQuickesttrain(trains) ;
//             // console.log('here') ;
//         }
//         if(obj.query != undefined && obj.query.localeCompare('shortestroutes') == 0){
//             trains = queryUtils.findShortestRoutes(trains) ;
//         }

//         // if(obj.low_range != undefined && obj.up_range != undefined){
//         //     trains = queryUtils.rangeMoney(trains,parseInt(obj.low_range),parseInt(obj.up_range)) ;  
//         //     console.log('here') ;     
//         // }
//         // if(obj.hour != undefined && obj.minutes != undefined){
//         //     trains = queryUtils.queryBytime(trains,(obj.hour*60+obj.minutes)*60) ;
//         // }

//         if(trains.length == 0){
//             res.status(404).json({message: "No trains found"});
//             return ;
//         }

            

    console.log(buslist,  route_companies)

    const bus_data = {

        route_companies : route_companies,
        buslist : buslist
    }

  res.status(200).json(bus_data); 


    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};


// //still doesnot need verification
const getSeatAvailableByspecificbus = async (req, res) => {
    try{
         let obj = {from : req.params.from, to : req.params.to, date : req.params.date , category : req.params.category, bus_name : req.body.bus_name};
//         console.log(obj);
//         let coach_id = await searchCommon(obj) ;

         let results = await filterbyBus(obj.from, obj.to, obj.date, obj.category, obj.bus_name) ;
    
    
//         //find all from train_schedule_info 
    
//         let results = await filter(obj.from,obj.to,obj.date) ;
//         console.log(results) ;

         let query3 = {
             text : 'SELECT dimension,last_middle FROM "bus_details" WHERE bus_name = $1',
             values : [obj.bus_name]
         }
//         let dimension = -1 ;
//         let coach_idx = -1 ;
         let {dimension,last_middle} = (await busPool.query(query3)).rows[0] ;
//         for(let j = 0 ; j<coaches.length;j++){
//             if(coaches[j] == coach_id){
//                 coach_idx = j ;
//                 dimension = dimensions[j] ;
//                 break ;
//             }
//         }
//         let l = results[0].routes.length ;
//         let times = queryUtils.timeDifference(new Date(results[0].routes[0].date),new Date(results[0].routes[l-1].date),results[0].routes[0].departure_time,results[0].routes[l-1].departure_time);
         let bus_result = {
             schedule_id : results[0].schedule_id,
             bus_id : results[0].bus_id,
             bus_name : results[0].bus_name ,
             bus_company : results[0].bus_company,
             departure_date : new Date(results[0].departure_date), 
             category : results[0].category,
             boarding : results[0].boarding,
             dropping : results[0].dropping,
             
             cost : results[0].cost ,

             source : results[0].source,
             destination : results[0].destination,

             start : results[0].start,
             stop : results[0].stop,

             departure_time : results[0].departure_time,
             arrival_time : results[0].arrival_time,


 //            availableSeats : availableSeats,

             dimension : dimension,
             last_middle : last_middle,

             seat_details : results[0].seat_details

//             routes : results[0].routes,
//             duration_hour :times.hours,
//             duration_minutes : times.minutes,
//             durations : times.durations,
//             departure_date : new Date(results[0].routes[0].date), 
//             departure_time : results[0].routes[0].time,
//             arrival_date :  new Date(results[0].routes[l-1].date),
//             arrival_time : results[0].routes[l-1].time,
//             cost_class : results[0].routes[l-1].cost_class[coach_idx] - results[0].routes[0].cost_class[coach_idx] ,
//             coach_name : obj.coach_name,
//             routes : results[0].routes,
//             seat : obj.seat ,
//             dimension: dimensions[coach_idx], //compart_Ment,col,row
//             seat_details : results[0].seat_details[coach_idx], //for each =========>[row,col,status,compartment]
//             routes : results[0].routes,
//             seat : obj.seat 
         }

         console.log(bus_result)
//             // }
//         // }

         res.status(200).json(bus_result);

    }catch (err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}



 module.exports = { getbusinfo,
//                     gettraininfoByfrom,
//                     gettraininfoByto,
//                     gettraininfoBytrainID,
                     getSeatAvailableByspecificbus,
//                     gettraininfoBytrainCompany,
//                     getAllroutesDetailsByTrainUid,
                 };    