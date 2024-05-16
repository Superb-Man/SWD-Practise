<script>

  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Input, Button, Label } from 'flowbite-svelte';
  // import { GridSolid, TicketOutline, DollarOutline , ArrowRightFromBracketSolid, QuestionCircleOutline } from 'flowbite-svelte-icons';
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '@fortawesome/fontawesome-free/css/all.css';
    import { storeTrainTotalCost } from '../../store/store';
  //import { writable } from 'svelte/store';
  //import { storeusername } from '../../store/store'/////////////////////
  
  // let spanClass = 'flex-1 ms-3 whitespace-nowrap';
  // let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
  // let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 bg-gray-200 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';
  // let activeUrl =  window.location.pathname + window.location.hash

  // let username = '';

  // //storeusername.subscribe( uname => { username = uname })/////////////////////

  // username = window.localStorage.getItem("username")

  // console.log(activeUrl,username)

  // let homepath = "/#/home/" + username

// {activeUrl} {activeClass} {nonActiveClass} {spanClass} href =  "{homepath}"



let lastSixValues = []

// const url = new URL(window.location.href)

// const pathsegments = url.hash.split('/').filter(Boolean)

// console.log(pathsegments)

// lastFiveValues = pathsegments.slice(-5)

// console.log(lastFiveValues)

function handleClick(event) {

    event.preventDefault();


    
}

let url = new URL(window.location.href)

let total = 0

lastSixValues = url.hash.split('/').filter(Boolean).slice(-6)

storeTrainTotalCost.subscribe( tot => { total = tot })



</script>



<Sidebar class = "w-full" >
  <SidebarWrapper class = "bg-gray-200 h-1/2 w-fit rounded-xl mt-4 cursor-default" >
    <SidebarGroup class = "cursor-default">

      <SidebarItem label= "Journey Details" class = "text-gray-800 hover:bg-gray-200 font-bold text-sm md:text-2xl cursor-default font-serif" on:click =  { handleClick } >
        <svelte:fragment slot="icon">

        <i class="fa-solid fa-md fa-suitcase-rolling mr-2 font-normal text-gray-800" > </i>
       </svelte:fragment>

      </SidebarItem>
    </SidebarGroup>

    <SidebarGroup border class = "border-black">
      <SidebarItem label= { lastSixValues[0] } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-plane-arrival mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Start : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>

      


      <SidebarItem label= { lastSixValues[1] } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-plane-departure mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Stoppage : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>
      
      <SidebarItem label= { lastSixValues[3] } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-plane-circle-xmark mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Coach : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>

      <SidebarItem label= { total.toLocaleString() } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        
          <i class="fa-solid fa-md fa-money-bill mr-3 font-normal text-gray-800" > </i>
          <p class="font-normal text-gray-800 text-sm md:text-lg"> Sumtotal : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>


  </SidebarGroup>
  <SidebarGroup border>

      <!-- <SidebarItem label="Time Range: {timeRange[0]} - {timeRange[1]} hours" for="time-slider" class = "text-gray-400 hover:bg-gray-800" on:click =  {handleClick}> -->

       
      <!-- </SidebarItem> -->


      <SidebarItem label="" class = "hover:bg-gray-800" on:click =  {handleClick} >
        <svelte:fragment slot="icon">

        <!-- <input type="range" id="time-slider" class = "w-full" min={timeRange[0]} max={up} step="1" bind:value={timeRange[1]} /> -->

        </svelte:fragment>
      </SidebarItem>


      <SidebarItem label="" class = "hover:bg-gray-800" on:click =  {handleClick} >

        <svelte:fragment slot="icon"  >

            
          <!-- <Button color="blue" class = "w-full" on:click = {() => filterTime()} > search </Button> -->

        </svelte:fragment>
        
      </SidebarItem>


      
      

  </SidebarGroup>
  
  </SidebarWrapper>
</Sidebar>



