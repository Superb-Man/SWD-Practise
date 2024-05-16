<script>

    import { Label,  Button,  Select, ButtonGroup } from 'flowbite-svelte';

    import { airports } from "../../data/airport_name"

    import { storeSource, storeDest } from "../../store/store"


    let lastFiveValues = []

    const url = new URL(window.location.href)

    const pathsegments = url.hash.split('/').filter(Boolean) 

    lastFiveValues = pathsegments.slice(-5)

    console.log( url, url.pathname, pathsegments, lastFiveValues )


    let source, dest

    let default_source = airports.find( airports => airports.value === lastFiveValues[0])?.name
  
    let default_dest = airports.find( airports => airports.value === lastFiveValues[1])?.name


    export let placeholder_status

</script>

<Label class = "relative w-full" for = "src">
        
    <i class="fa-solid fa-xl fa-plane-departure absolute left-3 top-1/2 cursor-pointer"></i>
    {#if placeholder_status === "true" }<Select items= { airports } id="src" placeholder="From" bind:value = { source } class = "pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer " on:change = { () => { storeSource.set(source) } } required />
  
    {:else} <Select items= { airports } id="text" placeholder = { ` ${ default_source } ` } bind:value = { source } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "  on:change = { () => {storeSource.set(source) } }  />
    
    {/if}

</Label>


<Label class = "relative w-full" for = "dest">
  
    <i class="fa-solid fa-xl fa-plane-arrival absolute left-3 top-1/2 cursor-pointer"></i>
    {#if placeholder_status === "true" }<Select items= { airports } id="dest" placeholder="To" bind:value = { dest } class = "pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer " on:change = { () => { storeDest.set(dest) } } required />

        {:else} <Select items= { airports } id="text" placeholder = { ` ${ default_dest } ` } bind:value = { dest } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "  on:change = { () => {storeDest.set(dest) } }  />
    
    {/if}

</Label>