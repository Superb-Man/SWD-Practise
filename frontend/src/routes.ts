
import home from "./assets/home.svelte"
import signupauth from "./assets/signup.svelte"
import signupforrm from "./assets/signupform.svelte"
import Dummyform from "./dummyform.svelte"


export const routes = {

    
    '/' : home,
    '/signup' : signupauth,
    '/signupform' : signupforrm,
    '/1' : Dummyform

}