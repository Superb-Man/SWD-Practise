// function findShortestRoutes(trains){
//     trains.sort((a,b)=>(a.routes.length - b.routes.length));

//     return trains ; 
// }

function earlyDeparture(buslist){
    buslist.sort((a, b) => {
        // Using localeCompare to compare strings lexicographically
        return a.departure_time.localeCompare(b.departure_time);
    });

    return buslist ;
}

function availSeat(buslist){
    buslist.sort((a, b) => {
        // Using localeCompare to compare strings lexicographically
        return b.availableSeats-a.availableSeats;
    });

    return buslist ;
}

function findCheapestBus(buslist){

    buslist.sort((a,b)=>(a.cost-b.cost));

    return buslist;

}


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

// function findQuickestTrain(trains){
//     // console.log('here') ;
//     //needs to be updated 
//     //needs to be handled manually
//     trains.sort((a,b)=>(a.durations-b.durations));
//     return trains ;
// }

 module.exports = { earlyDeparture,
                    availSeat,
                    findCheapestBus
//                    findShortestRoutes,
//                      timeDifference
                 } ;