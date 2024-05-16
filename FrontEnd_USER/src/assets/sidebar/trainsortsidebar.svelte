<script>

  import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Input, Button, Modal } from 'flowbite-svelte';
  import { GridSolid, TicketOutline, DollarOutline , ArrowRightFromBracketSolid, QuestionCircleOutline } from 'flowbite-svelte-icons';
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '@fortawesome/fontawesome-free/css/all.css';
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

let upRange = 3000, lowRange = 100

let lastFiveValues = []

//let openPriceRangeModal = false

let openModal = false, size = 'xs', color='red'



// const url = new URL(window.location.href)

// const pathsegments = url.hash.split('/').filter(Boolean)

// console.log(pathsegments)

// lastFiveValues = pathsegments.slice(-5)

// console.log(lastFiveValues)

function handleClick(event) {

    event.preventDefault();


    
}

function reformatDate(datedmy){

  let date = datedmy.split('-')

  let d = date[0], m = date[1], y = date[2]

  let datemdy = m + '-' + d + '-' + y

  return datemdy

}

let timeRange = [0, 100];

let up = timeRange[1]

let warningMessage = '';

let query = '';

import { storeTrain, storeTrainFilterStatus } from "../../store/store"

import { trainSearch } from '../../api/trainSearch';

//import PriceAlertModal from '../modals/priceAlertModal.svelte'

async function filterMoney() {

  if (lowRange > upRange) {
    
    warningMessage = 'Lower value cannot be higher than the upper limit.';
    openModal = true ;

  }

  else{

    let status = 0, url = new URL(window.location.href), air_line = []

    query = `low_range=${lowRange}&up_range=${upRange}&`

    lastFiveValues = url.hash.split('/').filter(Boolean).slice(-5)

    let x = lastFiveValues[4]

    lastFiveValues[4] = reformatDate(lastFiveValues[4])


    const response = await trainSearch(lastFiveValues,query)
      
    if (!response.ok) {
      status = response.status;
    }
    else {
      air_line = await response.json();
      
    }

    lastFiveValues[4] = x


    console.log(air_line,status)
    storeTrain.set( air_line );
    
    

    storeTrainFilterStatus.set( status )


  }

}

async function filterTime() {



  let status = 0, url = new URL(window.location.href)

  console.log(timeRange[1])

  query = `hour=${timeRange[1]}&minutes=0&`

  lastFiveValues = url.hash.split('/').filter(Boolean).slice(-5)

  let x = lastFiveValues[4]

  lastFiveValues[4] = reformatDate(lastFiveValues[4])

  const response = await trainSearch(lastFiveValues,query)
      
  if (!response.ok) {

      status = response.status;

  }
  const air_line = await response.json();

  lastFiveValues[4] = x

  console.log(air_line)
  
  storeTrain.set( air_line )

  storeTrainFilterStatus.set( status )




}


</script>



<Sidebar class = "h-screen">
  <SidebarWrapper class = "bg-gray-800 h-2/5 md:h-3/5 rounded-xl mt-4 w-fit md:w-full " >
    <SidebarGroup >



      <SidebarItem label="Set the max price" class = "text-gray-400 hover:bg-gray-800" on:click =  { handleClick } >
        <svelte:fragment slot="icon">
            
        <DollarOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        

        </svelte:fragment> 
          
      </SidebarItem>

      


      <SidebarItem label=""  class = "hover:bg-gray-800" on:click =  { handleClick }>
        <svelte:fragment slot="icon">
            
            <Input type= "number" id= "upper_lim" placeholder = { upRange } bind:value = {upRange} class= "w-full" ></Input>

        </svelte:fragment>
        
      </SidebarItem>
      
      <SidebarItem label= "Set the min price" class = "text-gray-400 hover:bg-gray-800" on:click =  { handleClick }>
        <svelte:fragment slot="icon">
          <DollarOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>

      <SidebarItem label="" class = "hover:bg-gray-800" on:click =  { handleClick }>

        <svelte:fragment slot="icon"  >
            
            <Input type= "number" id= "lower_lim" placeholder = { lowRange } bind:value = { lowRange } class= "w-full" ></Input>

        </svelte:fragment>
        
      </SidebarItem>

      <SidebarItem label="" class = "hover:bg-gray-800" on:click =  { handleClick }>

        <svelte:fragment slot="icon"  >
            
          <Button color="blue" class = "w-full" on:click = {() => filterMoney()}> search </Button>

        </svelte:fragment>
        
      </SidebarItem>


  </SidebarGroup>
  <SidebarGroup border>

      <SidebarItem label="Time Range: {timeRange[0]} - {timeRange[1]} hours" for="time-slider" class = "text-gray-400 hover:bg-gray-800" on:click =  {handleClick}>

       
      </SidebarItem>


      <SidebarItem label="" class = "hover:bg-gray-800" on:click =  { handleClick } >
        <svelte:fragment slot="icon">

        <input type="range" id="time-slider" class = "w-full" min={timeRange[0]} max={up} step="1" bind:value={timeRange[1]} />

        </svelte:fragment>
      </SidebarItem>


      <SidebarItem label="" class = "hover:bg-gray-800" on:click =  { handleClick } >

        <svelte:fragment slot="icon"  >

            
          <Button color="blue" class = "w-full" on:click = {() => filterTime()} > search </Button>

        </svelte:fragment>
        
      </SidebarItem>


      
      

  </SidebarGroup>
  
  </SidebarWrapper>
</Sidebar>

<!-- <PriceAlertModal openModal = { openPriceRangeModal } warningMessage = { warningMessage }/> -->

<Modal title= "ALERT" bind:open={ openModal } { size } { color } autoclose>{ warningMessage }</Modal>

