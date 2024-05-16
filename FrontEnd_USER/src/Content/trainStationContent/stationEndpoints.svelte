<script>

  import { Label,  Select } from 'flowbite-svelte';

  import { stationList } from "../../data/train_details"

  import { storeSource, storeDest } from "../../store/store"


  let lastFiveValues = []

  const url = new URL(window.location.href)

  const pathsegments = url.hash.split('/').filter(Boolean) 

  lastFiveValues = pathsegments.slice(-5)

  console.log( url, url.pathname, pathsegments, lastFiveValues )


  let source, dest

  let default_source = stationList.find( stationList => stationList.value === lastFiveValues[0])?.name

  let default_dest = stationList.find( stationList => stationList.value === lastFiveValues[1])?.name


  export let placeholder_status

</script>

<Label class = "relative w-full" for = "src">
      
  <i class="fa-solid fa-xl fa-train-tram absolute left-3 top-1/2 cursor-pointer"></i>
  {#if placeholder_status === "true" }<Select items= { stationList } id="src" placeholder="From" bind:value = { source } class = "pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer " on:change = { () => { storeSource.set(source) } } required />

  {:else} <Select items= { stationList } id="text" placeholder = { ` ${ default_source } ` } bind:value = { source } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "  on:change = { () => {storeSource.set(source) } }  />
  
  {/if}

</Label>


<Label class = "relative w-full" for = "dest">

  <i class="fa-solid fa-xl fa-train-subway absolute left-3 top-1/2 cursor-pointer"></i>
  {#if placeholder_status === "true" }<Select items= { stationList } id="dest" placeholder="To" bind:value = { dest } class = "pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer " on:change = { () => { storeDest.set(dest) } } required />

      {:else} <Select items= { stationList } id="text" placeholder = { ` ${ default_dest } ` } bind:value = { dest } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "  on:change = { () => {storeDest.set(dest) } }  />
  
  {/if}

</Label>