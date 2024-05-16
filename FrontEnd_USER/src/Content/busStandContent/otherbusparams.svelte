<script>

    import { Label, Select, ButtonGroup } from 'flowbite-svelte';

    import DatePicker from '../../assets/datepickers/journeydatepicker.svelte'

    import { storeBusCategory } from "../../store/store"

    let lastFourValues = []

    const url = new URL(window.location.href)

    const pathsegments = url.hash.split('/').filter(Boolean)

    lastFourValues = pathsegments.slice(-4)

    console.log( url, url.pathname, pathsegments, lastFourValues ) 

    //let seat_number = []

    export let defaultDate

    // for(let i = 1; i < 6; i++){

    //     seat_number.push( { value : i, name : i } )

    // }

    let categories = [ { value : "AC", name : "AC" } ,
                       { value : "nonAC", name : "nonAC" }, 
                       
                        ]

    let selectedDate = new Date()

    let category;

    let default_category = categories.find( categories => categories.value === lastFourValues[2])?.name
  
    export let placeholder_status

    const isSmallDevice = window.innerWidth <= 837

</script>

<div class = "relative w-full space-y-3 md:space-y-6" >
        
    <ButtonGroup class="w-full border-8 border-gray-400 rounded-lg ">

      <!-- <Label class = "relative w-1/2" for = "number"> 

        <i class="fa-solid fa-xl fa-chair absolute left-3 top-1/2 cursor-pointer"></i>
        {#if placeholder_status === "true" } <Select items= { seat_number } id="number" placeholder="seats" bind:value = { seats } class = " pl-10 font-bold font-serif bg-gray-100 rounded-none hover:bg-green-200 cursor-pointer "  on:change = { () => {storeSeatNumber.set(seats) } } required />
        
        {:else} <Select items= { seat_number } id="number" placeholder = { ` ${ default_seat_number } ` } bind:value = { seats } class = " pl-10 font-bold font-serif bg-gray-100 rounded-none hover:bg-green-200 cursor-pointer "  on:change = { () => {storeSeatNumber.set(seats) } } />

        {/if}

      </Label> -->

      <Label class = "relative w-full" for = "category"> 

        <i class="fa-solid fa-xl fa-lira-sign absolute left-3 top-1/2 cursor-pointer"></i>
        {#if placeholder_status === "true" }<Select items= { categories } id="coach" placeholder = "Category"  bind:value = { category } class = " pl-10 font-bold font-serif bg-gray-100 rounded-none hover:bg-green-200 cursor-pointer "  on:change = { () => { storeBusCategory.set(category) } } required />

        {:else} <Select items= { categories } id="text" placeholder = { ` ${ default_category } ` } bind:value = { category } class = " pl-10 font-bold font-serif bg-gray-100 rounded-none hover:bg-green-200 cursor-pointer "  on:change = { () => { storeBusCategory.set(category) } }  />

        
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