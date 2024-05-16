
import homeHome from "./assets/homeHome.svelte"

import trainHomeRoute from "./modules/train_module/trainHomeRoute.svelte"

import trainHomeSched from "./modules/train_module/trainHomeSched.svelte"

import trainHomeCoach from "./modules/train_module/trainHomeCoach.svelte"
import trainHomeConfig from './modules/train_module/trainHomeConfig.svelte'
import trainHomeStats from './modules/train_module/trainHomeStats.svelte'

// import trainHomeConfig from "./assets/train/trainHomeConfig.svelte"

import login from "./modules/auth_module/login.svelte"
import signupform from "./modules/auth_module/signupform.svelte"


// let username = ''

// export function getUsername(sent_username: string): void {
    
//     console.log(`Received username: ${sent_username}`);

//     username = sent_username
    
//     // username = '/' + username
    
// }

// console.log(username)

export const routes = {

    '/home/:username' : homeHome,

    '/home/:username/:train/route' : trainHomeRoute,

    '/home/:username/:train/sched' : trainHomeSched,

    '/home/:username/:train/coach' : trainHomeCoach,
    '/home/:username/:train/config' : trainHomeConfig,
    '/home/:username/:train/stats' : trainHomeStats,
    // '/home/:username/:addTrain' : homeHome,
    
    '/signup' : signupform,

    '/' : login,

    

    

    

}