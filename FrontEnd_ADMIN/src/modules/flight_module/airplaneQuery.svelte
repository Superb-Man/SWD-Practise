<script>

    import Homenavigation from "../../assets/train/navigation/homenavigation.svelte";


    import Endpoints from "../../Content/airportContent/portEndpoints.svelte";

    import Otherflightparams from "../../Content/airportContent/otherflightparams.svelte";

    import Sortsidebar from "../../assets/sidebar/flightsortsidebar.svelte";

    

    import { Alert, Avatar, Badge, Button, ButtonGroup, Modal, Timeline, TimelineItem } from "flowbite-svelte";

    import { AdjustmentsVerticalOutline, DollarSolid, CalendarWeekSolid, DotsVerticalOutline, LetterBoldOutline } from "flowbite-svelte-icons";

    //import FlightTansitModal from "../../assets/modals/flightTransitModal.svelte"
    
    // import { air_line } from "../data/airline_query"

  
    
    //for query in backend
    let query = '' ;

    let lastFiveValues = []

    const url = new URL(window.location.href)

    const pathsegments = url.hash.split('/').filter(Boolean)

    console.log(pathsegments)

    lastFiveValues = pathsegments.slice(-5)

    console.log(lastFiveValues)

    let openModal = false, size = 'xs', color = 'blue'

    let openTransitViewModal = false, openLoginAlertModal = false, modalAirLine =  { } 

    


    console.log( url, url.pathname, pathsegments, lastFiveValues )

    import { Card } from 'flowbite-svelte';
    import { onMount } from "svelte";
    
    import { storeAirline, storeAirlineFilterStatus, storeAirlineQuery, storeSelectedAirline } from "../../store/store"

    import { push } from 'svelte-spa-router'

    import { airlineSearch } from "../../api/airlineSearch";

    let air_line = [], status = 0

    storeAirline.subscribe( line => { air_line = line } )

    storeAirlineFilterStatus.subscribe( st => { status = st } )

    storeAirlineQuery.subscribe( q => { query = q } )

    function reformatDate(datedmy){

      let date = datedmy.split('-')

      let d = date[0], m = date[1], y = date[2]

      let datemdy = m + '-' + d + '-' + y

      return datemdy

    }

    function reformatDatedmony(datemdy) {

      const [month, day, year] = datemdy.split('/').map(Number);
      const dateObject = new Date(year, month - 1, day); // Month is zero-based
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
    
      return dateObject.toLocaleDateString('en-US', options);

    }

    async function todo(){


      status = 0

      //lastFiveValues[4] = "2024-1-29"

      let x = lastFiveValues[4]

      lastFiveValues[4] = reformatDate(lastFiveValues[4])

      const response = await airlineSearch(lastFiveValues,query)
      
      if (!response.ok) {

        status = response.status;

      }

      else air_line = await response.json();

      lastFiveValues[4] = x
    console.log(air_line);

    console.log(status)

    }
    // todo();

    onMount( async() => {

      todo()

      // const unsubscribe = reinitializeTrigger.subscribe( () => {
      //   todo()
      // })

    })

    // onDestroy((unsubscribe) => {
      
    //   unsubscribe();

    // });

    function pullString(transits){

      let x = transits[0].transit_port;

      for(var i = 1;i<transits.length; i++){

        x = x + "\u00A0" + "\u00A0" + "\u00A0" + "\u00A0"  

      }

      return x;

    }

   

    async function Quickest(){
      query = 'q=quickest&'
      todo()

    }

    async function Cheapest(){
      query = 'q=cheapest&'
      todo()

    }

    async function Earliest(){
      query = 'q=early_takeoff&'
      todo()

    }

    async function unsort(){
      query = ''
      todo()

    }

    import { storeSource, storeDest, storeSeatNumber, storePlaneClass, storeJourneyDate } from "../../store/store"

    let source =  lastFiveValues[0], dest = lastFiveValues[1], seat_number= parseInt(lastFiveValues[2],10), seat_class= lastFiveValues[3], selectedDate= lastFiveValues[4]


    async function search(){


      storeSource.subscribe( val => { if(val != "Not yet" ) source = val } )

      storeDest.subscribe( val => { if(val != "Not yet" ) dest = val } )

      storeSeatNumber.subscribe( val => { if(val != 0 ) seat_number = val} )

      storePlaneClass.subscribe( val => { if(val != "Not yet" ) seat_class = val } )

      storeJourneyDate.subscribe( val => { selectedDate = val } )

      lastFiveValues = [ source, dest, seat_number,seat_class,selectedDate ]

      window.location.href = `#/airplane/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}`

      

      todo()

      
      
    }

    async function showGrid(air_line){

      // /seat_details/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}/${flight_id}

      if(window.sessionStorage.getItem("username") == undefined){

        color = "red"

        openLoginAlertModal = true       


      }

      else {

        push(`/airplane/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}/${air_line.flight_id}`)
      }

      storeSelectedAirline.set(air_line)

      console.log(air_line)

      

      //push(`/airplane/${window.sessionStorage.getItem("username")/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}/${air_line.flight_id}}`)




    }

    function showModal(air_line){

      if(openLoginAlertModal == false){

        color = "blue"

        openTransitViewModal = true

        modalAirLine = air_line

      }

      

      //openModal = true;

    }



    
</script>

<div class = "flex flex-col w-screen h-screen overflow-y-hidden overflow-x-scroll fixed">
  
    <div class = "basis-1/3 bg-yellow-300 w-full h-1/5 top-0 left-0 fixed " >
      
     
      <div class = "flex flex-row w-screen h-screen ">
  
        <Homenavigation />
  
  
      </div>
      
    
    </div>


    <div class = "basis-1/3 bg-blue-800 w-full h-2/5 md:h-1/4 left-0 space-y-12 fixed" id = "top-18">

        <form>


            
            
                <div class = "w-full ">
            
            
                  
                
                  <div class="grid gap-6 mb-6 grid-cols-2 w-1/2 top-4 left-1/4 absolute">
            
                    
            
                    <Endpoints placeholder_status = "false"/>
            
            
                  </div>
            
                
                
                  <div class="grid gap-8 mb-6 grid-cols-2 top-4 w-full left-1/4 absolute">
            
                    <i class="fa-solid fa-lg fa-arrow-right justify-center cursor-pointer mt-7 ml-3 text-gray-200" ></i>
                
                  </div>
            
                </div>
            
                <div class = "w-full ">
            
            
                  <div class="container w-1/2 top-20 left-1/4 absolute">
            
                    <Otherflightparams defaultDate = { lastFiveValues[4] } placeholder_status = "false"/>
            
                  </div>
            
                  <div class=" justify-center right-1/4 lg:right-8 top-48 md:top-40 lg:top-20 absolute">
            
                    <Button shadow color="dark" type = "submit" border-color = "dark" class = "border-4 mt-2" on:click = { () => search() }> Search </Button>
            
                  </div>
            
            
                </div>
            
                  
                
                <!-- <i class="fa-solid fa-xl fa-plane-departure absolute left-3 top-1/2 cursor-pointer"></i>
                      <Select items= { airports } id="src" placeholder="From" bind:value = { source } class = ""  required /> -->
            
            
            
            
                
            </form>  
    
    </div>


    <div id = "top-adjust-div" class = "basis-1/3 w-full h-2/5 md:h-3/5 left-0 fixed -mt-2 overflow-y-scroll" > 

      
      
      
      
      <div class="flex flex-row w-full ">
  
         

        
        

        <div class = "w-full left-80 space-y-10 absolute overflow-y-hidden overflow-x-hidden">  

          <div class="max-w-2xl w-fit " >

          <ButtonGroup >
            <Button outline color="dark" class= " rounded-l-md rounded-r-none" on:click = { () => Quickest()}>
              
              <AdjustmentsVerticalOutline class="w-3 h-3 me-2" />
              Sort by quickest flight
            </Button>
            <Button outline color="dark" class= "  rounded-none" on:click = { () => Cheapest()}>
              <DollarSolid class="w-3 h-3 me-2" />
              Sort by pricing
            </Button>
            <Button outline color="dark" class= "  rounded-none" on:click = { () => Earliest()}>
              <i class="fa-solid fa-plane-departure me-2"></i>
              Sort by earliest takeoff
            </Button>
            <Button outline color="dark" class= " rounded-r-md rounded-l-none" on:click = { () => unsort()}>
              <!-- <i class="fa-solid fa-plane-departure"></i> -->
              Unsort
            </Button>
          </ButtonGroup>

          </div>

          {#if status === 404} 

          <div class="max-w-2xl" >

            <Alert>
              <span class="font-medium">OOPS!</span>
              No flights match your search 
            </Alert>

          </div>

          {:else}


          {#each air_line as airline}
  
          
          <!-- -->
          <div class="max-w-2xl" >

            

            

            <Card horizontal size = "xl" class = "bg-gray-200 w-fit relative cursor-pointer" padding = "md" on:click = { () => showModal(airline)}>

              <div class = " border-r border-gray-400 justify-center w-28 relative my-2">
                <Avatar size="md" src = { airline.logo } class = "ml-8"/>
                <Badge color="yellow" class="mt-4 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ airline.air_company_name }</Badge>
              </div>

             

              <div class = "justify-center w-24 relative my-auto">
                <p class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ airline.from_Port }</p>
                <Badge color="red" class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ airline.departure_time }</Badge>
                <p class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ airline.departure_date }</p>
              </div>

              <div class = "my-auto relative w-96 " >

              <Timeline order="horizontal" >

                { #if airline.transits.length == 0 }

                  <TimelineItem title="direct" date="" >
    
                    <svelte:fragment slot="icon">
                      <div class="flex items-center">
                        <!-- <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                          <DotsVerticalOutline class="w-3 h-3 text-primary-600 dark:text-primary-400" />
                        </div> -->
                        <div class="hidden sm:flex w-80 ml-6 bg-rose-600 h-0.5 dark:bg-gray-700" />
                      </div>
                    </svelte:fragment>
                    
    
                  </TimelineItem>

                { :else }

             
                    <TimelineItem title={ pullString(airline.transits) } date="" >

                    

                    
    
                      <svelte:fragment slot="icon">
                        <div class="flex items-center">
                          <!-- <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <DotsVerticalOutline class="w-3 h-3 text-primary-600 dark:text-primary-400" />
                          </div> -->
                          <div class="hidden sm:flex w-80 ml-6 bg-rose-600 h-0.5 dark:bg-gray-700" />
                        </div>
                      </svelte:fragment>
                      
      
                    

                    

                    </TimelineItem>

                   

                  

                {/if}  
  
              </Timeline>

              </div>
              

              <div class = " justify-center w-24 relative my-auto ">
                <p class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ airline.to_Port }</p>
                <Badge color="green" class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold ">{ airline.arrival_time }</Badge>
                <p class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ airline.arrival_date }</p>
              </div>

            

              <div class = " justify-center w-24 relative my-auto">
                
                <p class="mt-1/2 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ airline.duration_hour } h { airline.duration_minutes} m</p>
              </div>

              <div class = " border-l border-gray-800 justify-center w-28 relative my-2">
                
                <Badge color="yellow" class="mt-1/2 text-md w-24 tracking-tight text-gray-900 dark:text-white relative mb-4">Tk : { airline.cost_class }</Badge>

                <Button shadow color="dark" on:click = { () => showGrid(airline)}> Book </Button> 
             
              </div>

            

              
            </Card>
          
            

          </div>

          {/each}

          {/if}
          
        <div></div>

        <div></div>

        
        
        
        </div>

        <!-- id= "top-adjust-sidebar" -->

        <div  id = "top-adjust-sidebar"> 

          <Sortsidebar />

        </div>
        
        
            
      </div>

       
    
    </div>

    
    <!-- <div id = "top-adjust-sidebar" class = "basis-1/3 w-full h-2/5 md:h-3/5 left-0 fixed overflow-y-visible" > -->

       
  
    <!-- </div> -->
    

</div>

<!-- <div class = "top-0 fixed" > -->
          
  



<!-- </div>  -->

<!-- <FlightTansitModal openModal = { openTransitViewModal } modalAirLine = { modalAirLine }/> -->

<Modal title= { modalAirLine.air_company_name } bind:open={ openTransitViewModal } { size } { color } autoclose>
  <Timeline order="vertical" class = "border-rose-600 font-bold">
    <TimelineItem title={ modalAirLine.to_Port } date={ reformatDatedmony( modalAirLine.departure_date ) }>
      <svelte:fragment slot="icon">
        <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
          
          <i class="fa-solid fa-plane-up w-3 h-3 text-primary-600 dark:text-primary-400" ></i>

        </span>
      </svelte:fragment>
      <p class=" text-base font-bold text-gray-500 dark:text-gray-400">{ modalAirLine.departure_time }</p>
      <p class=" text-base font-bold font-serif text-gray-500 dark:text-gray-400">{ modalAirLine.flight_id }</p>
      
    </TimelineItem>

    { #if modalAirLine.transits.length != 0 }

      { #each modalAirLine.transits as transit }

        <TimelineItem title={ transit.transit_port } date={ reformatDatedmony( new Date(transit.date).toLocaleDateString() ) }>
          <svelte:fragment slot="icon">
            <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
          
              <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>

            </span>
          </svelte:fragment>
          <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> { transit.time } </p>
          <p class=" text-base font-bold font-serif text-gray-500 dark:text-gray-400"> { transit.flight_id } </p>
          
        </TimelineItem>

      { /each }

    {/if}
    

    <TimelineItem title={ modalAirLine.from_Port } date={ reformatDatedmony(modalAirLine.arrival_date) }>
      <svelte:fragment slot="icon">
        <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
        
          <i class="fa-solid fa-plane-up w-3 h-3 text-primary-600 dark:text-primary-400" ></i>
        
        </span>
      </svelte:fragment>
      <p class="text-base font-bond text-gray-500 dark:text-gray-400"> { modalAirLine.arrival_time } </p>
    </TimelineItem>

  </Timeline>
</Modal>

<Modal title= "Forgot to login?" bind:open={ openLoginAlertModal } { size } { color } autoclose>

  You need to login to Book the seats

</Modal>

<style>

  #top-18 {

    top: 18%

  }

  @media only screen and (max-width: 2048px){
    #top-adjust-sidebar {

      top: 42%;
      position: fixed; 
      

    }

  }

  @media only screen and (max-width: 600px){
    #top-adjust-sidebar {

      top: 58%;
      position: fixed; 

    }

  } 

  
   @media only screen and (max-width: 2048px){

    #top-adjust-div {

      top: 45%

    }

  } 

  @media only screen and (max-width: 600px){
    #top-adjust-div {

      top: 60%

    }

  } 

</style>