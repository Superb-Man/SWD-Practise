<script>

  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Input, Button, Label } from 'flowbite-svelte';
  // import { GridSolid, TicketOutline, DollarOutline , ArrowRightFromBracketSolid, QuestionCircleOutline } from 'flowbite-svelte-icons';
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '@fortawesome/fontawesome-free/css/all.css';
  import { storeBusTotalCost, storeBusBoardTime, storeBusDropTime } from '../../store/store';
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



let lastFourValues = []

// const url = new URL(window.location.href)

// const pathsegments = url.hash.split('/').filter(Boolean)

// console.log(pathsegments)

// lastFiveValues = pathsegments.slice(-5)

// console.log(lastFiveValues)

function handleClick(event) {

    event.preventDefault();


    
}

let url = new URL(window.location.href)

let total = 0, board_time, drop_time

lastFourValues = url.hash.split('/').filter(Boolean).slice(-4)

storeBusTotalCost.subscribe( tot => { total = tot })

storeBusBoardTime.subscribe( time => { board_time = time })

storeBusDropTime.subscribe( time => { drop_time = time })



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

      
        
      <SidebarItem label= { window.sessionStorage.getItem('storeBusCompany') } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-bus mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Bus : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>

      


      <SidebarItem label= { window.sessionStorage.getItem('storeSelectedBusName') } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-bus mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Coach : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>
      
      <SidebarItem label= {board_time} class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-clock mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Departure Time : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>

      <SidebarItem label= {drop_time} class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        
          <i class="fa-solid fa-md fa-clock mr-3 font-normal text-gray-800" > </i>
          <p class="font-normal text-gray-800 text-sm md:text-lg"> Arrival Time : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>


      
      

  </SidebarGroup>

    <SidebarGroup border class = "border-black">
      <SidebarItem label= { lastFourValues[0] } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-bus-simple mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Start : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>

      


      <SidebarItem label= { lastFourValues[1] } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-bus-simple mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Stoppage : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>
      
      <SidebarItem label= { lastFourValues[3] } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <i class="fa-solid fa-md fa-lira-sign mr-2 font-normal text-gray-800" > </i>
        <!-- <DollarOutline class="w-5 h-5 text-gray-500" /> -->
        <p class="font-normal text-gray-800 text-sm md:text-lg"> Category : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>

      <SidebarItem label= { total.toLocaleString() } class = "text-blue-400 hover:bg-gray-200 font-bold text-sm md:text-xl cursor-default" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        
          <i class="fa-solid fa-md fa-money-bill mr-3 font-normal text-gray-800" > </i>
          <p class="font-normal text-gray-800 text-sm md:text-lg"> Sumtotal : </p>
        

        </svelte:fragment> 
          
      </SidebarItem>


  </SidebarGroup>
  
  
  </SidebarWrapper>
</Sidebar>



