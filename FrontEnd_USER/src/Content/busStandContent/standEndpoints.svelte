<script>

  import { Label,  Select } from 'flowbite-svelte';

  import { standList } from "../../data/bus_details"

  import { storeSource, storeDest } from "../../store/store"


  let lastFourValues = []

  const url = new URL(window.location.href)

  const pathsegments = url.hash.split('/').filter(Boolean) 

  lastFourValues = pathsegments.slice(-4)

  console.log( url, url.pathname, pathsegments, lastFourValues )


  let source, dest

  let default_source = standList.find( standList => standList.value === lastFourValues[0])?.name

  let default_dest = standList.find( standList => standList.value === lastFourValues[1])?.name


  export let placeholder_status

</script>

<Label class = "relative w-full" for = "src">
      
  <i class="fa-solid fa-xl fa-bus-simple absolute left-3 top-1/2 cursor-pointer"></i>
  {#if placeholder_status === "true" }<Select items= { standList } id="src" placeholder="From" bind:value = { source } class = "pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer " on:change = { () => { storeSource.set(source) } } required />

  {:else} <Select items= { standList } id="text" placeholder = { ` ${ default_source } ` } bind:value = { source } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "  on:change = { () => {storeSource.set(source) } }  />
  
  {/if}

</Label>


<Label class = "relative w-full" for = "dest">

  <i class="fa-solid fa-xl fa-bus-simple absolute left-3 top-1/2 cursor-pointer"></i>
  {#if placeholder_status === "true" }<Select items= { standList } id="dest" placeholder="To" bind:value = { dest } class = "pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer " on:change = { () => { storeDest.set(dest) } } required />

      {:else} <Select items= { standList } id="text" placeholder = { ` ${ default_dest } ` } bind:value = { dest } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "  on:change = { () => {storeDest.set(dest) } }  />
  
  {/if}

</Label>