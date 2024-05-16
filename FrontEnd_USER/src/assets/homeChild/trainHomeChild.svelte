<script>



import Endpoints from "../../Content/trainStationContent/stationEndpoints.svelte"
import Othertrainparams from "../../Content/trainStationContent/othertrainparams.svelte";

import { storeSource, storeDest, storeSeatNumber, storeJourneyDate, storeTrainCoach } from "../../store/store"


import { push } from 'svelte-spa-router'


import { Button } from 'flowbite-svelte'


let  source, dest, seat_number, seat_class, selectedDate



async function train_query(){

  storeSource.subscribe( val => { source = val } )

  storeDest.subscribe( val => { dest = val } )

  storeSeatNumber.subscribe( val => { seat_number = val} )

  storeTrainCoach.subscribe( val => { seat_class = val } )

  storeJourneyDate.subscribe( val => { selectedDate = val } )

  push(`/train/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}`)

}


function validateInputs() {
    const form = document.querySelector('form');

    
      if (form.reportValidity()) {
      
        train_query();

      }
}

</script>

<form>


<div class = "container">

    <div class = "w-full ">


      <div class="font-serif w-1/2 top-24 absolute font-bold"> <p class= "text-2xl md:text-3xl"> Where do you want to go ?</p></div>

    
      <div class="grid gap-6 mb-6 grid-cols-1 md:grid-cols-2 w-1/2 top-48 absolute">

        

        <Endpoints placeholder_status = "true" />


      </div>

    
    
      <div class="md:grid gap-8 mb-6 grid-cols-2 top-48 w-full absolute hidden sm:block">

        <i class="fa-solid fa-lg fa-arrow-right justify-center cursor-pointer mt-7 ml-3"></i>
    
      </div>

    </div>

    <div class = "w-full ">


      <div class="container w-1/2 top-84 md:top-72 absolute">

        <Othertrainparams defaultDate = { new Date() }  placeholder_status = "true" />

      </div>

      <div class="justify-center top-128 md:top-2/3 lg:right-8 lg:top-72 absolute">

        <Button shadow color="dark" type = "submit" border-color = "dark" class = "border-4 mt-2" on:click = { () => validateInputs() }> Search </Button>

      </div>


    </div>

      
    
    <!-- <i class="fa-solid fa-xl fa-plane-departure absolute left-3 top-1/2 cursor-pointer"></i>
          <Select items= { airports } id="src" placeholder="From" bind:value = { source } class = ""  required /> -->


</div>

    
</form>  


<style>

  @media only screen and (max-width: 600px) {
    .top-84{

      top: 336px;

    }

    .top-128{

      top: 512px;

    }
  }
</style>
  