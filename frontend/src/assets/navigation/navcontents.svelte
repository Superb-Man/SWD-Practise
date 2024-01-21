<script>

    import { Button } from 'flowbite-svelte';

    import { UserCircleOutline } from 'flowbite-svelte-icons'
    //import { storecardstatus, storestringcard } from '../../store/store'

    import { storecardtitle, storecardcontent } from '../../store/store'

    import { push } from 'svelte-spa-router'


    let stringCardTitle;
    let stringCardContent;

    storecardtitle.subscribe( title => { stringCardTitle = title} )
    storecardcontent.subscribe( content => { stringCardContent = content} )

    function showCard(title,content) {

     storecardtitle.set(title)
     storecardcontent.set(content)
    
   }

   function signup(){

    push('/signup')

   }

   function login(){

    push('/login')

   }
    

    // let cardstatus;
    // let stringCard;

    // storecardstatus.subscribe( val => { cardstatus = val} )
    // storestringcard.subscribe( val => { stringCard = val} )
    

    // function showCard(str) {

    //     storecardstatus.set(true)
    //     storestringcard.set(str)
        
    // }

    // const unShowCard = () => {

    //     storecardstatus.set(false)

    // }

</script>

<div class = "mt-12 ">

    <div class = "flex flex-row space-x-10 ">

        <!-- <div ><GradientButton shadow color="teal" > Login </GradientButton></div> -->

        <div></div>
        <div></div>
        <div></div>

        <div >
            
            <Button id="sign-up" shadow color="dark" on:mouseenter = { () =>  showCard("SignUp","Want to Register?") } on:click = { () => signup() } > Sign Up </Button> 
            
        </div>

        <div >
            
            <Button id="sign-in" shadow color="dark" on:mouseenter = { () => showCard("Login","Want to Sign into your account?") } on:click = { () => login() } > Login </Button> 

            
        </div>

        <div></div>
        <!-- <div></div> -->

        <div >
            
            <UserCircleOutline id="sign-profile" shadow class = " w-10 h-10 cursor-pointer" on:mouseenter = { () => showCard("User Profile","View or edit your profile?") } > </UserCircleOutline> 
            
            
        </div>

        

    </div>        

</div>

<!-- <div>

    {#if cardstatus === true}

        <Iconcard stringCard = { stringCard } /> 
        
    {/if}

</div> -->