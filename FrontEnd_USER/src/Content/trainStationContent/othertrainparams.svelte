<script>

    import { Label, Select, ButtonGroup } from 'flowbite-svelte';

    import DatePicker from '../../assets/datepickers/journeydatepicker.svelte'

    import { storeSeatNumber, storeTrainCoach } from "../../store/store"

    let lastFiveValues = []

    const url = new URL(window.location.href)

    const pathsegments = url.hash.split('/').filter(Boolean)

    lastFiveValues = pathsegments.slice(-5)

    console.log( url, url.pathname, pathsegments, lastFiveValues ) 

    let seat_number = []

    export let defaultDate

    for(let i = 1; i < 6; i++){

        seat_number.push( { value : i, name : i } )

    }

    import { seatType } from '../../data/train_details';

    let selectedDate = new Date()

    let seats,seat_class;

    let default_seat_class = seatType.find( seatType => seatType.value === lastFiveValues[3])?.name
  
    let default_seat_number = seat_number.find( seat_number => seat_number.value === parseInt( lastFiveValues[2] , 10 ) )?.name

    export let placeholder_status

    const isSmallDevice = window.innerWidth <= 837

</script>

<div class = "relative w-full space-y-3 md:space-y-6" >
        
    <ButtonGroup class="w-full border-8 border-gray-400 rounded-lg ">

      <Label class = "relative w-1/2" for = "number"> 

        <i class="fa-solid fa-xl fa-chair absolute left-3 top-1/2 cursor-pointer"></i>
        {#if placeholder_status === "true" } <Select items= { seat_number } id="number" placeholder="seats" bind:value = { seats } class = " pl-10 font-bold font-serif bg-gray-100 rounded-none hover:bg-green-200 cursor-pointer "  on:change = { () => {storeSeatNumber.set(seats) } } required />
        
        {:else} <Select items= { seat_number } id="number" placeholder = { ` ${ default_seat_number } ` } bind:value = { seats } class = " pl-10 font-bold font-serif bg-gray-100 rounded-none hover:bg-green-200 cursor-pointer "  on:change = { () => {storeSeatNumber.set(seats) } } />

        {/if}

      </Label>

      <Label class = "relative w-1/2" for = "coach"> 

        <i class="fa-solid fa-xl fa-truck-fast absolute left-3 top-1/2 cursor-pointer"></i>
        {#if placeholder_status === "true" }<Select items= { seatType } id="coach" placeholder = "coach"  bind:value = { seat_class } class = " pl-10 font-bold font-serif bg-gray-100 rounded-none hover:bg-green-200 cursor-pointer "  on:change = { () => { storeTrainCoach.set(seat_class) } } required />

        {:else} <Select items= { seatType } id="text" placeholder = { ` ${ default_seat_class } ` } bind:value = { seat_class } class = " pl-10 font-bold font-serif bg-gray-100 rounded-none hover:bg-green-200 cursor-pointer "  on:change = { () => { storeTrainCoach.set(seat_class) } }  />

        
        {/if}

      </Label>

      <!-- <Label class = "relative w-full" for = "number"> 

        <i class="fa-solid fa-xl fa-plane-arrival absolute left-3 top-1/2 cursor-pointer"></i>
        <Select items= { airports } id="dest" placeholder="To" bind:value = { source } class = " pl-10 font-bold font-serif bg-gray-100 h-18 rounded-none hover:bg-green-200  "  required />

      </Label> -->

       { #if isSmallDevice === false }

        <DatePicker selectedDate = { selectedDate } default_Date = { defaultDate } /> 
       

       {/if}

      

  </ButtonGroup>

  {#if isSmallDevice === true} 

    <ButtonGroup class="w-full border-0 border-gray-400 rounded-lg ">


      <DatePicker selectedDate = { selectedDate } default_Date = { defaultDate } /> 


    </ButtonGroup>

  {/if}

  
  
</div>