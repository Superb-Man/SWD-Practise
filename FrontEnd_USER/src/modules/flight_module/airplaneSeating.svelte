<script>

    import Homenavigation from '../../assets/navigation/homenavigation.svelte';
    import Detailsidebar from "../../assets/sidebar/flightjourneysidebar.svelte";
    import AirplaneGrid from '../../assets/grid/airplaneGrid.svelte';

    

</script>


<div class = "flex flex-col w-screen h-screen fixed overflow-y-hidden overflow-x-hidden">

  <div class = "basis-1/3 bg-gray-300 w-full h-1/5 top-0 left-0 fixed " >
    
   
    <div class = "flex flex-row w-screen h-screen">

      <Homenavigation />


    </div>
  
  </div>

  <div class = "basis-2/3 w-full h-4/5 left-0 fixed overflow-x-scroll" id = "top-adjust"> 

    <div class="flex flex-row w-full">

      

      <div class = "w-auto absolute left-adjust-grid space-y-4 mt-4  " >  
              
              
          <AirplaneGrid />
              
          <div></div>
            
      </div>

      <div class = "basis-1/5 h-full w-1/3 fixed mb-8 " id = "top-adjust" > <Detailsidebar /> </div>


      
      
        
    </div>

    

  </div>

</div>

<style>

  @media only screen and (max-width: 2048px){

    #top-adjust {

      top: 20%

    }

  }

  @media only screen and (max-width: 2048px){

    .left-adjust-grid {

      left: 40%;

    }

  }

  @media only screen and (max-width: 600px){

    .left-adjust-grid {

      left: 60%;

    }

  }

  

</style>