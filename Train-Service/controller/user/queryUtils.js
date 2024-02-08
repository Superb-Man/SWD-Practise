// function findCheapestFlight(flights){
//     flights.sort((a,b)=>(a.cost_class-b.cost_class));
// }

// function rangeMoney(flights,low,high){
//     let ans = [] ;
//     for(let i = 0;i<flights.length;i++){
//         if(flights[i].cost_class>=low && flights[i].cost_class<=high){
//             ans.push(flights[i]);
//         }
//     }
//     console.log(ans.length) ;
//     return ans ;
// }

// function earlyDeparture(flights){
//     flights.sort((a, b) => {
//         // Using localeCompare to compare strings lexicographically
//         return a.departure_time.localeCompare(b.departure_time);
//     });

//     return flights ;
// }

// function timeDifference(date1,date2,time1,time2){
//     date1 = new Date(date1);
//     date2 = new Date(date2);    
//     var [h1,m1,s1] = time1.split(':').map(Number) ;
//     var [h2,m2,s2] = time2.split(':').map(Number); 
//     date1 = new Date(date1.getFullYear(),date1.getMonth(),date1.getDate(),h1,m1);
//     date2 = new Date(date2.getFullYear(),date2.getMonth(),date2.getDate(),h2,m2);
//     // Calculate the difference in milliseconds 
//     var difference_ms = Math.abs(date2 - date1);
//     var d = difference_ms / 1000;
    
//     // Convert milliseconds difference to hours, minutes, and seconds
//     var difference_hours = Math.floor(difference_ms / (1000 * 60 * 60));
//     difference_ms -= difference_hours * (1000 * 60 * 60);
//     var difference_minutes = Math.floor(difference_ms / (1000 * 60));
//     difference_ms -= difference_minutes * (1000 * 60);
//     var difference_seconds = Math.floor(difference_ms / 1000);
//     let diff = {
//         hours : difference_hours,
//         minutes : difference_minutes,
//         durations : d
//     }
//     return diff ;
// }

// function findQuickestFlight(flights){
//     // console.log('here') ;
//     //needs to be updated 
//     //needs to be handled manually
//     flights.sort((a,b)=>(a.durations-b.durations));
//     return flights ;
// }

// function queryBytime(flights,duration) {
//     let ans = [] ;
//     duration = Math.floor(duration / 10) ;
//     console.log(duration) ;

//     for(let i = 0 ; i < flights.length ; i++) {
//         console.log(flights[i].durations) ;
//         if(flights[i].durations <= duration) {
//             ans.push(flights[i]) ;
//         }
//     }

//     ans.sort((a,b)=>(a.durations - b.durations)) ;

//     return ans ;

// }

// module.exports = { findCheapestFlight,
//                     findQuickestFlight,
//                     rangeMoney,
//                     earlyDeparture,
//                     timeDifference,
//                     queryBytime,
//                 } ;