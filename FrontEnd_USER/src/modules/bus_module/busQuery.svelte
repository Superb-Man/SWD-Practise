<script>

    import Homenavigation from "../../assets/navigation/homenavigation.svelte";


    import Endpoints from "../../Content/busStandContent/standEndpoints.svelte";

    import Otherbusparams from "../../Content/busStandContent/otherbusparams.svelte";

    //import Sortsidebar from "../../assets/sidebar/trainsortsidebar.svelte";

    //import { getTrainRoute } from "../../api/trainRoute";

    import { Alert, Avatar, Badge, Button, ButtonGroup, Checkbox, Modal, Timeline, TimelineItem } from "flowbite-svelte";

    import { AdjustmentsVerticalOutline, DollarSolid, CalendarWeekSolid, DotsVerticalOutline, LetterBoldOutline } from "flowbite-svelte-icons";

    //import FlightTansitModal from "../../assets/modals/flightTransitModal.svelte"
    
    // import { air_line } from "../data/airline_query"

  
    
    //for query in backend
    let query = '' ;

    let companyfilterlist = [];

    let companyfulllist = []

    let lastFourValues = []

    const url = new URL(window.location.href)

    const pathsegments = url.hash.split('/').filter(Boolean)

    console.log(pathsegments)

    lastFourValues = pathsegments.slice(-4)

    console.log(lastFourValues)

    let openModal = false, size = 'xs', color = 'blue'

    let openRouteViewModal = false, openLoginAlertModal = false, modalRoute =  { } 

    let doFilter = false

    


    console.log( url, url.pathname, pathsegments, lastFourValues )

    import { Card } from 'flowbite-svelte';
    import { onMount } from "svelte";
    
    import { storeBus, storeBusCategory, storeBusFilterStatus, storeBusQuery, storeSelectedBus } from "../../store/store"

    import { push } from 'svelte-spa-router'

    import { busSearch } from "../../api/busSearch";

    let bus_list = [], status = 0

    //storeAirline.subscribe( line => { air_line = line } )

    storeBusFilterStatus.subscribe( st => { status = st } )

    storeBusQuery.subscribe( q => { query = q } )

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

    async function callFilterApi(){

      let selected_route_companies = {

        "selected_route_companies" : companyfilterlist

      }

      const formData = JSON.stringify(selected_route_companies)

      const response = await busSearch(lastFourValues,query,formData)

      return response
    }

    async function todo(){


      status = 0

      let data

      //lastFiveValues[4] = "2024-1-29"

      let x = lastFourValues[3]

      lastFourValues[3] = reformatDate(lastFourValues[3])

      const response = await callFilterApi()
      
      if (!response.ok) {

        status = response.status;

      }

      else data = await response.json();

      bus_list = data.buslist
      companyfulllist = data.route_companies

      lastFourValues[3] = x
    console.log(bus_list,companyfulllist);

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

    // function pullString(transits){

    //   let x = transits[0].transit_port;

    //   for(var i = 1;i<transits.length; i++){

    //     x = x + "\u00A0" + "\u00A0" + "\u00A0" + "\u00A0"  

    //   }
    //   return x;

    // }

   

    async function avail(){
      query = 'q=seats_available&'
      todo()

    }

    async function Cheapest(){
      query = 'q=cheapest&'
      todo()

    }

    async function Earliest(){
      query = 'q=early_departure&'
      todo()

    }

    async function filter(){
      if(doFilter == false) doFilter = true;

      else if(doFilter == true) {

        doFilter = false
        companyfilterlist = []
        todo()

      }

      

    }

    function isCompanyInList(company, list) {

      return list.some(item => item === company);

    }

    function removeCompanyFromList(company, list) {

      return list.filter(item => !(item === company ));

    }

    async function filterByCompany(company){

      if(isCompanyInList(company, companyfilterlist) == true){

        companyfilterlist = removeCompanyFromList(company, companyfilterlist)

      }

      else{

        companyfilterlist = [...companyfilterlist, company]

      }

      console.log(companyfilterlist)

      todo()


    }

    import { storeSource, storeDest, storeJourneyDate } from "../../store/store"
    //import { routes } from "../../routes";

    let source =  lastFourValues[0], dest = lastFourValues[1] , category= lastFourValues[2], selectedDate= lastFourValues[3]


    async function search(){


      storeSource.subscribe( val => { if(val != "Not yet" ) source = val } )

      storeDest.subscribe( val => { if(val != "Not yet" ) dest = val } )

      storeBusCategory.subscribe( val => { if(val != "Not yet" ) category = val } )

      storeJourneyDate.subscribe( val => { selectedDate = val } )

      lastFourValues = [ source, dest, category, selectedDate ]

      window.location.href = `#/bus/${source}/${dest}/${category}/${selectedDate}`

      

      todo()

      
      
    }

    async function showGrid(bus){

      // /seat_details/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}/${flight_id}

      if(window.sessionStorage.getItem("username") == undefined){

        color = "red"

        openLoginAlertModal = true       


      }

      //else {

        push(`/bus/seat/${source}/${dest}/${category}/${selectedDate}`)
      //}

      storeSelectedBus.set(bus)

      window.sessionStorage.setItem('storeSelectedBusName', bus.bus_name)
      window.sessionStorage.setItem("storeBusCompany",bus.bus_company)
      window.sessionStorage.setItem("storeDepartureTime",bus.departure_time)
      window.sessionStorage.setItem("storeArrivalTime",bus.arrival_time)

      console.log(bus)

      

      //push(`/airplane/${window.sessionStorage.getItem("username")/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}/${air_line.flight_id}}`)




    }

    async function showModal(bus){

      if(openLoginAlertModal == false){

//         let jsonData = {
// //mail,pass,phone,nid
        
//           "bus_name" : bus.bus_name,
//           "schedule_id" : bus.schedule_id,
          
        
    
//         };

//         const formData = JSON.stringify(jsonData);

        //const response = await getTrainRoute( formData );

        //modalRoute = await response.json()

        modalRoute = bus

        console.log(modalRoute)

        color = "blue"

        openRouteViewModal = true

        

      }

      

      //openModal = true;

    }



    
</script>

<div class = "flex flex-col w-screen h-screen overflow-y-hidden overflow-x-scroll fixed">
  
    <div class = "basis-1/3 bg-gray-300 w-full h-1/5 top-0 left-0 fixed " >
      
     
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
            
                    <Otherbusparams defaultDate = { lastFourValues[3] } placeholder_status = "false"/>
            
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
  
         

        
        

        <div class = "w-full left-20 space-y-10 absolute overflow-y-hidden overflow-x-hidden">  

          <div class="max-w-2xl w-fit " >

          <ButtonGroup >
            <Button outline color="dark" class= " rounded-l-md rounded-r-none" on:click = { () => avail()}>
              
              <AdjustmentsVerticalOutline class="w-3 h-3 me-2" />
              Sort by available seats
            </Button>
            <Button outline color="dark" class= "  rounded-none" on:click = { () => Cheapest()}>
              <DollarSolid class="w-3 h-3 me-2" />
              Sort by pricing
            </Button>
            <Button outline color="dark" class= "  rounded-none" on:click = { () => Earliest()}>
              <i class="fa-solid fa-bus me-2"></i>
              Sort by earliest departure
            </Button>
            <Button outline color="dark" class= " rounded-r-md rounded-l-none" on:click = { () => filter()}>
              <!-- <i class="fa-solid fa-plane-departure"></i> -->
              Filter
            </Button>
          </ButtonGroup>

          </div>

          

          {#if status === 404} 

          <div class="max-w-2xl" >

            <Alert>
              <span class="font-medium">OOPS!</span>
              No available buses yet 
            </Alert>

          </div>

          {:else}

          {#if doFilter == true}

            <Card size = "xl" class = "bg-gray-200 w-fit relative ">

              <div class="grid grid-cols-4 gap-20">

                {#each companyfulllist as _}

                  <Checkbox class= "cursor-pointer" color="green" on:click = { () => filterByCompany(_)}>{_}</Checkbox>

                {/each}
              </div>

            
            </Card>

          {/if}


          {#each bus_list as bus}
  
          
          <!-- -->
          <div class="max-w-2xl" >


            

            

            

            <Card horizontal size = "xl" class = "bg-gray-200 w-fit relative cursor-pointer" padding = "md" on:click = { () => showModal(bus)}>

              <div class = " border-r border-gray-400 justify-center w-48 relative my-2">
                <Avatar size="md" src = { bus.logo } class = "ml-16"/>
                <Badge color="yellow" class="mt-4 text-sm w-40 tracking-tight text-gray-900 dark:text-white relative">{ bus.bus_name }</Badge>
                <p class="ml-8 mt-4 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ bus.bus_company }</p>
              </div>

             

              <div class = "justify-center w-28 relative my-auto">
                <p class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ bus.start }</p>
                <Badge color="red" class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ bus.departure_time  }</Badge>
                <!-- <p class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ new Date(trainline.departure_date).toLocaleDateString() }</p> -->
              </div>

              <div class = "my-auto relative w-96 " >

              <Timeline order="horizontal" >

                  <TimelineItem title="routes" date="" >
    
                    <svelte:fragment slot="icon">
                      <div class="flex items-center">
                        <!-- <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                          <DotsVerticalOutline class="w-3 h-3 text-primary-600 dark:text-primary-400" />
                        </div> -->
                        <div class="hidden sm:flex w-80 ml-6 bg-rose-600 h-0.5 dark:bg-gray-700" />
                      </div>
                    </svelte:fragment>
                    
    
                  </TimelineItem>

                

             
                    <!-- <TimelineItem title={ pullString(trainline.transits) } date="" >

                    

                    
    
                      <svelte:fragment slot="icon">
                        <div class="flex items-center">
                           <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                            <DotsVerticalOutline class="w-3 h-3 text-primary-600 dark:text-primary-400" />
                          </div> 
                          <div class="hidden sm:flex w-80 ml-6 bg-rose-600 h-0.5 dark:bg-gray-700" />
                        </div>
                      </svelte:fragment>
                      
      
                    

                    

                    </TimelineItem> -->

                   

                  

                
  
              </Timeline>

              </div>
              

              <div class = " justify-center w-28 relative my-auto ">
                <p class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ bus.stop }</p>
                <Badge color="green" class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold ">{ bus.arrival_time }</Badge>
                <!-- <p class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ new Date(trainline.arrival_date).toLocaleDateString() }</p> -->
              </div>

            

              <div class = " justify-center w-28 relative my-auto ml-2">

                <p class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">Seats Available </p>
                
                <p class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ bus.availableSeats } </p>
              </div>

              <div class = " border-l border-gray-800 justify-center w-28 relative my-auto">
                
                <Badge color="yellow" class="mt-1/2 text-md w-24 tracking-tight text-gray-900 dark:text-white relative mb-4">Tk : { bus.cost }</Badge>

                <Button shadow color="dark" on:click = { () => showGrid(bus)}> Book </Button> 
             
              </div>

            

              
            </Card>
          
            

          </div>

          {/each}

          {/if}
          
        <div></div>

        <div></div>

        
        
        
        </div>

        <!-- id= "top-adjust-sidebar" -->

        <!-- <div  id = "top-adjust-sidebar"> 

          <Sortsidebar />

        </div> -->
        
        
            
      </div>

       
    
    </div>

    
    <!-- <div id = "top-adjust-sidebar" class = "basis-1/3 w-full h-2/5 md:h-3/5 left-0 fixed overflow-y-visible" > -->

       
  
    <!-- </div> -->
    

</div>

<!-- <div class = "top-0 fixed" > -->
          
  



<!-- </div>  -->

<!-- <FlightTansitModal openModal = { openTransitViewModal } modalAirLine = { modalAirLine }/> -->

<Modal title= { modalRoute.bus_name } bind:open={ openRouteViewModal } { size } { color } autoclose>

  <p class = "font-bold text-left"> Boarding points :</p>
  <Timeline order="vertical" class = "border-rose-600 font-bold">
    <!-- <TimelineItem title={ modalRoute.routes[0].start } date={ reformatDatedmony( new Date(  modalRoute.routes[0].date ).toLocaleDateString() ) }>
      <svelte:fragment slot="icon">
        <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
          
          <i class="fa-solid fa-train w-3 h-3 text-primary-600 dark:text-primary-400" ></i>

        </span>
      </svelte:fragment>
      <p class=" text-base font-bold text-gray-500 dark:text-gray-400">{ modalRoute.routes[0].departure_time }</p> -->
      <!-- <p class=" text-base font-bold font-serif text-gray-500 dark:text-gray-400">{ modalRoute.flight_id }</p> -->
      
    <!-- </TimelineItem> -->

    <!-- { #if modalRoute.routes.length != 0 } -->

      { #each modalRoute.boarding as boarding }

        <!-- {#if index != 0 && index != modalRoute.routes.length-1 } -->

        <!-- date={ reformatDatedmony( new Date(modalRoute.departure_date).toLocaleDateString() ) } -->

          <TimelineItem title={ boarding.checkpoint } >
            <svelte:fragment slot="icon">
              <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
            
                <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>

              </span>
            </svelte:fragment>
            <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> { boarding.counter } </p>
            <!-- <p class=" text-base font-bold font-serif text-gray-500 dark:text-gray-400"> { transit.flight_id } </p> -->
            
          </TimelineItem>

        <!-- {/if } -->

      { /each }

    <!-- {/if} -->
    

    <!-- <TimelineItem title={ modalRoute.routes[modalRoute.routes.length-1].start } date={ reformatDatedmony( new Date(modalRoute.routes[modalRoute.routes.length-1].date).toLocaleDateString() ) }>
      <svelte:fragment slot="icon">
        <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
        
          <i class="fa-solid fa-train w-3 h-3 text-primary-600 dark:text-primary-400" ></i>
        
        </span>
      </svelte:fragment>
      <p class="text-base font-bond text-gray-500 dark:text-gray-400"> { modalRoute.routes[modalRoute.routes.length-1].departure_time } </p>
    </TimelineItem> -->

  </Timeline>

  

  

  <p class = "font-bold text-left"> Dropping points :</p>

  


  
  <Timeline order="vertical" class = "border-rose-600 font-bold">
    

      { #each modalRoute.dropping as dropping }

        
          <TimelineItem title={ dropping.checkpoint } >
            <svelte:fragment slot="icon">
              <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
            
                <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>

              </span>
            </svelte:fragment>
            <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> { dropping.counter } </p>
            
          </TimelineItem>

       
      { /each }


  </Timeline>


</Modal>

<Modal title= "Forgot to login?" bind:open={ openLoginAlertModal } { size } { color } autoclose>

  You need to login to Book the seats

</Modal>

<style>

  #top-18 {

    top: 18%

  }

  /* @media only screen and (max-width: 2048px){
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

  } */

  
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