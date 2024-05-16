
import homeHome from "./assets/homeHome.svelte"
import airplaneHome from "./assets/airplaneHome.svelte"
import trainHome from "./assets/trainHome.svelte"
import busHome from "./assets/busHome.svelte"
import login from "./modules/auth_module/login.svelte"
import signupform from "./modules/auth_module/signupform.svelte"
import profile from "./modules/flight_module/airplaneSeating.svelte"
import airplaneQuery from "./modules/flight_module/airplaneQuery.svelte"
import trainQuery from "./modules/train_module/trainQuery.svelte"
import busQuery from "./modules/bus_module/busQuery.svelte"
import airplaneSeating from "./modules/flight_module/airplaneSeating.svelte"
import trainSeating from "./modules/train_module/trainSeating.svelte"
import busSeating from "./modules/bus_module/busSeating.svelte"
import ticketHistory from "./modules/ticket_history/ticket_history_home.svelte"
import airplanePassengers from "./modules/flight_module/airplanePassengers.svelte"

// let username = ''

// export function getUsername(sent_username: string): void {
    
//     console.log(`Received username: ${sent_username}`);

//     username = sent_username
    
//     // username = '/' + username
    
// }

// console.log(username)

export const routes = {

    
    '/' : homeHome,

    '/home' : homeHome,

    '/home/:username' : homeHome,
    
    '/signup' : signupform,

    '/login' : login,

    '/profile' : profile,

    '/airplane/:source/:dest/:seatNumber/:seatClass/:selectedDate?' : airplaneQuery,

    '/train/:source/:dest/:seatNumber/:seatClass/:selectedDate?' : trainQuery,

    '/bus/:source/:dest/:category/:selectedDate?' : busQuery,

    '/airplane' : airplaneHome,

    '/train' : trainHome,

    '/bus' : busHome,

    '/airplane/:source/:dest/:seatNumber/:seatClass/:selectedDate?/:flight_id' : airplaneSeating,

    '/train/:source/:dest/:seatNumber/:seatClass/:selectedDate?/:train_uid' : trainSeating,

    '/bus/seat/:source/:dest/:category/:selectedDate?' : busSeating,

    '/airplane/:username/:source/:dest/:seatNumber/:seatClass/:selectedDate?/:flight_id/bookseat' : airplanePassengers,

    '/history/:username' : ticketHistory,

    

    

}