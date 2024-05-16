<script>
	  //import homeside bar from modules directory
    import Homesidebar from "../modules/train_module/homesidebar.svelte";
    import Homenavigation from "../modules/train_module/navigation/homenavigation.svelte";
    import Destcarousel from "./carousels/destcarousel.svelte";
    import Homenavpopover from "../modules/train_module/popovers/homenavpopover.svelte";
    import footer from "./footer.svelte";
    
    import { suggestions } from '../images/suggestions.js';

    import TrainHomeChildRoute from "../modules/train_module/trainHomeChildRoute.svelte"
    import TrainHomeChildSched from "../modules/train_module/trainHomeChildSched.svelte";
    import TrainHomeChildCoach from "../modules/train_module/trainHomeChildCoach.svelte";
    import TrainHomeChildConfig from "../modules/train_module/trainHomeChildConfig.svelte";
    import TrainHomeChildStats from "../modules/train_module/trainHomeChildStats.svelte";


    export let route;

    let option;

    
    
    // let airports = [

    //   { value: 'us', name: 'United States' },
    //   { value: 'ca', name: 'Canada' },
    //   { value: 'fr', name: 'France' }

    // ];

    
    
    

    //import { storecardstatus, storestringcard } from '../store/store';


    // let cardstatus ;
    // let stringCard;
    
    // storecardstatus.subscribe( val => { cardstatus = val } )

    // storestringcard.subscribe( val => { stringCard = val })
    
    //console.log(cardstatus)

    

</script>

<!-- <div class = "row">

  <div class = "col-lg-4"><Dummysidebar /></div>


  <div class = "col-lg-4">
    
    <h1>App</h1>
    <a href = '/#/dummy'> Dummy </a>
    <a href = '/#/dummy2'> Dummy2 </a> 
    
    
    <h1>Home</h1> 

  </div>


  
</div> -->

<!-- <div class = "flex flex-row border-2 border-rose-700 items-start space-x-100">  

  <div class = "basis-1/4 border-2 border-rose-600"> <h1> Fjhbvvtftyfrtccvyvt </h1> </div>
  <div class = "basis-1/2 border-2 border-rose-100"> <h1> Fjhbvvtftyfrtccvyvt </h1> </div>
  <div class = "basis-1/4 border-2 border-rose-100"> <h1> Fjhbvvtftyfrtccvyvt </h1> </div>

</div>  -->
 

<!-- <div class="columns-4 h-screen border-2 border-rose-600 "> 

  <div class = "w-full min-h-screen border-2 border-rose-600"> <Dummysidebar />  </div>
  <div class = "w-full h-screen border-2 border-rose-600"> 

    <p> Fjhbvvtftyfrtccvyvt </p> 
  
  </div> 

  <div class = "w-full h-screen border-2 border-rose-600"> 

    <h2> Fjhbvvtftyfrtccvyvt </h2> 

  </div>

  <div class = "w-full h-screen border-2 border-rose-600"> 

    <h2> Fjhbvvtftyfrtccvyvt </h2> 

  </div>
  
  on:submit={handleSubmit}

          {#if formError}
            <p>{formError}</p>
          {/if}
 
</div> -->

<!-- change the AddRoute to only '+' icon -->

<div class = "flex flex-col w-screen h-screen fixed overflow-y-hidden overflow-x-scroll md:overflow-x-hidden">

  <div class = "basis-1/3 bg-gray-300 w-full h-16per top-0 left-0 fixed " >
    
   
    <div class = "flex flex-row w-full h-screen">

      <Homenavigation route = { route }/>

    </div>

  </div>

  <!-- <div class = "basis-1/3 bg-gray-300 w-full h-2/5 left-0 md:h-16 space-y-12 fixed" id = "top-18" >
  
    <div class = "flex flex-row w-screen h-screen">

      {#if route === "train"}

        <div class="max-w-2xl w-fit left-1/2 fixed" >

          <ButtonGroup >
            <Button outline color="dark" class= " rounded-l-md rounded-r-none" on:click = {() => { option = "route"}}>
              
              
              Route
            </Button>
            <Button outline color="dark" class= "  rounded-none" on:click = {() => { option = "coach"}}>
              
              Coach
            </Button>
            
            <Button outline color="dark" class= " rounded-r-md rounded-l-none" on:click = {() => { option = "sched"}}>
              
              Schedule info
            </Button>
          </ButtonGroup>

        </div>
      
      {/if}



    </div>
  
  </div> -->

  <div class = "basis-2/3 w-full h-4/5 mt-2 left-0 fixed overflow-y-scroll overflow-x-scroll md:overflow-x-hidden" id = "top-16per"> 

    <div class="flex flex-row w-full ">

      

      {#if route == "home"}

        <div class = "w-screen pl-48 md:pl-72 lg:pl-96 space-y-20">  

        
        

          <Destcarousel  images = { suggestions } title = "Top Suggestions" />
          
          <Destcarousel  images = { suggestions } title = "Trending in Bangladesh" />

          <div></div>
      
        </div>
        
      

      {:else}

      <div class = "w-screen pl-48 md:pl-72 lg:pl-96 space-y-12">

        {#if route == "coach"}

        
         <TrainHomeChildCoach />
        
        {/if}

        {#if route == "route"}

        
         <TrainHomeChildRoute />
        
        {/if}

        {#if route == "sched"}

          <TrainHomeChildSched />

        {/if} 
        {#if route == "config"}

        <TrainHomeChildConfig />
        {/if}
        {#if route == "stats"}
        <TrainHomeChildStats />
        {/if} 
        
      <div></div>
      
      </div>

      {/if}
  
      <div class = "basis-1/5 h-full fixed mb-2 " id = "top-20" > <Homesidebar /> </div>
    </div>
  
  </div>

  
  

</div>




<!-- <div class = "top-24 right-36 fixed">

  {#if cardstatus == true }
    
      <Iconcard stringCard = {stringCard} />

  {/if}

</div> -->

<Homenavpopover />

<style>

  /* #top-25 {

    top: 25%

  } */

  #top-16per {

    top: 16%

  }

  .h-16per {

    height: 16%

  }

</style>



<!-- <div class = "flex flex-row space-x-60 border-2 border-rose-600">

  <div class = "basis-1/4 border-2 border-rose-600">

   <Dummysidebar /> 

  </div>

  <div class = "basis-3/4 border-2 border-rose-600">

    <h1>App</h1>
    <a href = '/#/dummy'> Dummy </a>
    <a href = '/#/dummy2'> Dummy2 </a> 
    
    
    <h1>Home</h1> 

  </div>

</div> -->

  


  

