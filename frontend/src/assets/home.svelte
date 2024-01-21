<script>
    import Homesidebar from "./sidebar/homesidebar.svelte";
    import Homenavigation from "./navigation/homenavigation.svelte";
    import Destcarousel from "./carousels/destcarousel.svelte";
    import Homenavpopover from "./popovers/homenavpopover.svelte";
    
    import { suggestions } from '../images/suggestions.js';
    


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

<div class = "flex flex-col w-screen h-screen fixed overflow-y-hidden overflow-x-hidden">

  <div class = "basis-1/3 bg-yellow-300 w-full h-1/5 top-0 left-0 fixed " >
    
   
    <div class = "flex flex-row w-screen h-screen">

      <Homenavigation />


    </div>
  
  </div>

  <div class = "basis-2/3 w-full h-4/5 top-40 mt-2 left-0 fixed overflow-y-scroll"> 

    <div class="flex flex-row w-full ">

      <div class = "basis-1/5 h-full fixed top-40 mb-2 " > <Homesidebar /> </div>
      <div class = "w-screen pl-96 space-y-20">  

        
        <Destcarousel  images = { suggestions } title = "Top Suggestions" />
        <Destcarousel  images = { suggestions } title = "Trending in Bangladesh" />
        
      <div></div>
      
      </div>
  
    </div>
  
  </div>

  
  

</div>




<!-- <div class = "top-24 right-36 fixed">

  {#if cardstatus == true }
    
      <Iconcard stringCard = {stringCard} />

  {/if}

</div> -->

<Homenavpopover />



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

  
