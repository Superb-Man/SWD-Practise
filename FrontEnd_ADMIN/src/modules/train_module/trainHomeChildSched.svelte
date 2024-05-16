<script>
	import { routes } from './../../routes.ts';

    import { Alert, Button, ButtonGroup, Select } from "flowbite-svelte"
    import { AdjustmentsVerticalOutline, ThumbsDownOutline } from "flowbite-svelte-icons";

    import { AccordionItem, Accordion, Avatar, Badge, Card, Modal, Timeline, TimelineItem} from 'flowbite-svelte';
    import {Input, Label} from 'flowbite-svelte';
    import { Toast } from 'flowbite-svelte';
    import { Checkbox } from 'flowbite-svelte';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.min.css';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import '@fortawesome/fontawesome-free/css/all.css';

    import { trainlines } from "../../data/train_details";
    import { intersection } from 'zod';
    import { onMount, onDestroy } from 'svelte';
    import { get, readable, writable } from 'svelte/store';
    import {fade,fly,slide} from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { getAllCoaches, getScheduleByUID } from '../../api/trainAdmin/trainGet';
    import { getRoutes } from '../../api/trainAdmin/trainGet';
    import {addDetails, getSeatInfoBySchedule} from '../../api/trainAdmin/trainPost'
    import {addRoutes,deleteRoutes,updateRoutes,updateSchedule} from '../../api/trainAdmin/trainPost'
    import {addSchedule} from '../../api/trainAdmin/trainPost'
    import { afterUpdate } from 'svelte';
    import { Textarea } from 'flowbite-svelte';

    function convertToLocalDate(dateString, inputFormat='YYYY-MM-DD', outputFormat='medium') {
        var inputDate = new Date(dateString);
        
        // Ensure inputDate is a valid date object
        if (isNaN(inputDate.getTime())) {
            return "Invalid date";
        }

        var localDate = inputDate.toLocaleDateString(undefined, {timeZone: 'UTC'});
        var formattedLocalDate = new Date(localDate).toLocaleDateString(undefined, {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, dateStyle: outputFormat});

        return formattedLocalDate;
    }


    // function handleOpen() {

    // }


    let showToast = false ;
    let trainResults = [] ;

    // Function to show the toast
    // function showToastMessage(message) {
    //   showToast.set(true);
    //   setTimeout(() => showToast.set(false), 3000); // Hide toast after 3 seconds
    // }

    let train = window.sessionStorage.getItem("selected")

    let modalRoute = {}, color, openRouteViewModal = false , size = 'sm';
    let add_sched = false;
    let schedularModal = false;
    let iter,interval ;
    let trainRoutes = [[],]
    let route_id = []
    //make a get req to get route from server
    let trainstationList = [[],]
    let schedInfo ;
    let index = 0 ;
    let booking = 0 ;
    let schedModal = false ;
    let updateModal = false ;
    let cancelModal = false ;
    let msg = '' ;
    let username = window.sessionStorage.getItem("username") ;

    async function showModal(train){

        modalRoute = train

        console.log(modalRoute)

        color = "blue"
        if(schedModal == false){
          openRouteViewModal = true
        }
        //openModal = true;

      }

      async function getAllSched() {
        const response = await getScheduleByUID(train) ;
        if(!response.ok){
          console.log("error") ;
          return ;
        }
        if(response.status != 200){
          console.log("no schedule found") ;
          return ;
        }
        trainResults = await response.json() ;
        console.log(trainResults) ;

      }

      async function todo() {
        const response = await getRoutes(train) ;
        console.log("PIGGG")
        if(!response.ok){
            console.log("error") ;
            return ;
        }
        if(response.status != 200){
            console.log("no routes found") ;
            return ;
        }
        let data = await response.json() ;
        console.log(data) ;
        console.log(train) ;
        for(let i = 0 ; i < data.length ; i++){
            trainRoutes[i] = data[i].routes ;
            trainstationList[i] = data[i].routes.map(f=>f.start) ;
            console.log(trainstationList[i])
            route_id[i] = data[i].route_id;
        }
        console.log(trainRoutes)
        init(index) ;
      }

      onMount(async()=> {
        getAllSched() ;
        await todo() ; 
      })


      //schedule adding
      function init(idx) {
        console.log("init trainRoutes",trainRoutes[idx]) ;
        //init it to size of trainRoutes
        let d = new Date() ;
        msg = '' ;
        schedInfo = trainRoutes[idx].map(f=>{
          return {
            date: d.setDate(d.getDate() - 1),
            departure_time: '10:00'
          }
        });
      }

      async function doSchedule(i){
        //ekhane post request create korbe
        console.log("ScheduleInfo",schedInfo)
        console.log(trainRoutes[i])
        //check if any date is null or departure_time is null then return of schedinfo
        if(schedInfo.some(f=>f.date < new Date())){
          //show a alert message
          console.log("error in date handling") ;
          // showToast = true ;
          return;
        }

        let newRoutesSched = trainRoutes[i].map((f,idx)=>{
          return {
            ...f,
            date: new Date(schedInfo[idx].date),
            departure_time: schedInfo[idx].departure_time + ":00"
          }
        });
        console.log(newRoutesSched)
        console.log("new",newRoutesSched)

        
        let dates = schedInfo.map(f=>f.date) ;
        console.log(dates) ;
        let postData = {
          train_uid: train,
          routes: newRoutesSched,
          booking : booking ,
          cancel_deadline: dates[0],
          company_name : username,
        }
        const response = await addSchedule(postData) ;
        if(!response.ok){
          console.log("error") ;
          return ;
        }
        if(response.status != 200){
          console.log("Error") ;
          return ;
        }
        getAllSched() ;
        init(i) ;

        console.log(newRoutesSched);
      }

      function updateDates(interval) {
        //update the date by setDate of schedInfo
        schedInfo = schedInfo.map(f=>{
          let date = new Date(f.date);
          date.setDate(date.getDate() + parseInt(interval));
          return {
            ...f,
            date: date,
          }
        });
        console.log(schedInfo)
      }

      function schedular(itr,interval,index) {
          if(schedInfo.some(f=>f.date < new Date())){
            //show a alert message
            console.log("booking",booking) ;
            console.log("error in date handling") ;
            return;
          }
          //call the doSchedule at every interval looping itr number
          doSchedule(index) 
          for (let i = 0; i < itr-1; i++) {
              updateDates(interval);
              doSchedule(index)
          }
          add_sched = false;
          booking = 0 ;
      }

      let schedId = -1 ;
      let ticketData = []
      function seeDetails(id) {
        console.log(schedId) ;
        schedId = id ;
        getTicketInfo() ;
        schedModal = true ;
        openRouteViewModal = false ;
      }

      async function getTicketInfo() {
        let data = {
          schedule_id : schedId ,
          train_uid : train
        }
        const response = await getSeatInfoBySchedule(data) ;
        if(!response.ok){
          console.log("error") ;
          return ;
        }
        if(response.status != 200){
          console.log("no ticket found") ;
          return ;
        }
        ticketData = await response.json() ;
      }

      function update(train){
        modalRoute = train ;
        updateModal = true ;
        //map all the date and departure_time to schedInfo
        //return date in mm-dd-yyyy format
        // let defaultDate = new Date().toLocaleDateString('en-US').split('/').map((item, index) => {
        //   return item.length === 1 ? '0' + item : item;
        // }).join('-');
        schedInfo = train.routes.map(f=>{
          return {
            date: new Date(f.date),
            departure_time: f.departure_time
          }
        });
        console.log(schedInfo)
      }

      async function updateSChed(schedId) {
        //map routes date and departure time to schedInfo and remain same as before
        //update the schedule
        console.log(modalRoute)
        let data = {
          schedule_id : schedId,
          train_uid : train,
          routes :modalRoute.routes.map((f,idx)=>{
            return {
              ...f,
              date: new Date(schedInfo[idx].date),
              departure_time: schedInfo[idx].departure_time 
            }
          }) ,
          booking : booking,
          message : msg
        }
        console.log(data) ;
        const response  = await updateSchedule(data) ;
        if(!response.ok){
          console.log("error") ;
          return ;
        }
        if(response.status != 200){
          console.log("no schedule found") ;
          return ;
        }
        getAllSched() ;
        msg = '' ;
        booking = 0 ; 
        updateModal = false ;
      }

      // function initializeDatePicker() {
      //   flatpickr(inputElement, {
      //     dateFormat: 'm-d-Y',
      //     onChange: (selectedDates, dateStr) => {
      //       selectedDate = dateStr;
      //     },
      //   });
      // }

      

      // afterUpdate(() => {

      //   initializeDatePicker();
      // });



</script>

<div class="max-w-2xl w-fit space-y-5">

    

    {#if window.sessionStorage.username === undefined} 

    

        <Alert>

            <span class="font-medium">Sorry!</span>
            You have to sign in first 

        </Alert>

    {:else }

    <h1 class = "font-bold text-center " > { train } </h1>
      <Card style="background-color:#ffffee" class = "shadow-lg flex-justify-content dark:md hover:rounded cursor-pointer transition transform hover:-translate-y-1 motion-reduce:transition-shadow motion-reduce:hover:transform-none ..." size = "sm"
      on:click={()=>add_sched = true}>
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm11-4.2a1 1 0 1 0-2 0V11H7.8a1 1 0 1 0 0 2H11v3.2a1 1 0 1 0 2 0V13h3.2a1 1 0 1 0 0-2H13V7.8Z" clip-rule="evenodd"/>
            </svg>
            <h3 class= "text-left flex-justify-content">
                <b>Add Schedule</b>                
      </Card>
      {#if add_sched}
      <ButtonGroup class="flex items-start">
        <Button outline color="dark" class= "flex-justify-content rounded-l-md rounded-r-none" on:click = { () => index = 0}>
          Route1
        </Button>
        <Button outline color="dark" class= " rounded-r-md rounded-l-none" on:click = { () => index = 1}>
          <!-- <i class="fa-solid fa-plane-departure"></i> -->
          Route2
        </Button>
      </ButtonGroup>
      <!-- <Card class="w-full"> -->
      <!-- <div class = "w-full mt-8 left-1/4 absolute h-fit"> -->
        <Card class="addsched shadow-lg" size="md" style="background-color:#ffffee">

        <h2 class = "font-bold text-left mb-8 font-serif" > Route-{index+1} </h2>
            <Timeline order="vertical" class = "border-rose-600 font-bold event fade-in">

                { #each trainstationList[index] as stoppage,idx }
                <div class="flex-justify-content grid grid-cols-3 space-x-px">

                    <TimelineItem title={ stoppage } date="">
                        <svelte:fragment slot="icon">
                        <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
                            <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>
                        </span>
                        </svelte:fragment>
                        <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> &nbsp; </p>                        
                        
                    </TimelineItem>
                    <div class="flex flex-col space-y-4">
                      <Input type="date" bind:value={schedInfo[idx].date} id="date"  required />
                    </div>
                    <div class="flex flex-col space-y-4">
                      <Input type="time" bind:value={schedInfo[idx].departure_time} id="time"  required />
                    </div>
                </div>
                { /each }

            </Timeline>
            


          {#if trainstationList[index].length != 0}
            {#if booking == 0}
              <Checkbox color="green" on:click={()=>booking = 1}>Booking</Checkbox>
            {:else}
              <Checkbox checked color="green" on:click={()=>booking = 0}>Booking</Checkbox>
            {/if}
            <div class="flex-justify-content grid-cols-2">
              <ButtonGroup class="w-16 space-x-px">
                <Button pill color="purple"class="hover:bg-blue-500" on:click={()=>schedularModal = true}>Schedular</Button>
                <Button pill color="purple" class="rounded-none hover:bg-green-500" on:click={()=>schedular(1,1,index)}>Submit</Button>
                <Button pill color="purple" class="hover:bg-red-500" on:click={()=>add_sched=false}>Cancel</Button>
              </ButtonGroup>
            </div>
          {/if}

        </Card>
        

    

      <!-- </div> -->
    <!-- </Card> -->
    <!-- make an else block -->
    <!-- {:else} -->
    {/if}

        

      <!-- <Accordion> -->
        

        <div class="flex-items-row">
          
        </div>
        { #each trainResults as trainline }
            <Card horizontal style="background-color:#ffffee" size = "xl" class = "rounded-lg w-fit relative cursor-pointer" padding = "md" on:click = { () => showModal(trainline)}>

              <div class = " border-r border-gray-400 justify-center w-28 relative my-2">
                <Avatar size="md" src = { trainline.logo } class = "ml-8"/>
                <Badge rounded class="bg-gray-200 mt-4 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative border-black" border>{ trainline.train_uid }</Badge>
              </div>

             

              <div class = "justify-center w-24 relative my-auto">
                <p class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ trainline.routes[0].start }</p>
                <Badge color="red" class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ trainline.routes[0].departure_time  }</Badge>
                <p class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ convertToLocalDate(new Date(trainline.departure_date)) }</p>
              </div>

              <div class = "my-auto relative w-72 " >

              <Timeline order="horizontal" >

                  <TimelineItem title="routes" date="" >
    
                    <svelte:fragment slot="icon">
                      <div class="flex items-center">
                        <!-- <div class="flex z-10 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-0 ring-white dark:bg-primary-900 sm:ring-8 dark:ring-gray-900 shrink-0">
                          <DotsVerticalOutline class="w-3 h-3 text-primary-600 dark:text-primary-400" />
                        </div> -->
                        <div class="hidden sm:flex w-60 ml-6 bg-rose-600 h-0.5 dark:bg-gray-700" />
                      </div>
                    </svelte:fragment>
                    
    
                  </TimelineItem>
  
              </Timeline>

              </div>
              

              <div class = " justify-center w-24 relative my-auto ">
                <p class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ trainline.routes[trainline.routes.length-1].start }</p>
                <Badge color="green" class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold ">{ trainline.routes[trainline.routes.length-1].departure_time }</Badge>
                <p class="mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ convertToLocalDate(new Date(trainline.arrival_date)) }</p>
              </div>

              

              <div class = " justify-center w-24 relative my-auto">
                
                <p class="mt-1/2 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ trainline.duration_hour } h { trainline.duration_minutes} m</p>
              </div>
              <div class = " border-l border-gray-800 justify-center w-28 relative my-2">
                
                <Badge color="yellow" class="mt-1/2 text-md w-24 tracking-tight text-gray-900 dark:text-white relative mb-4">See Ticket Info </Badge>

                <Button shadow color="dark" on:click={()=>seeDetails(trainline.schedule_id)}> Details </Button> 
             
              </div>

            


              
            </Card>
              <ButtonGroup class="flex items-end">
                <Button outline color="dark" class= "flex-justify-content rounded-l-md rounded-r-none" on:click = { () => update(trainline)}>
                  Update Sched
                </Button>
                <Button outline color="dark" class= " rounded-r-md rounded-l-none" on:click = { () => cancelModal = true}>
                  <!-- <i class="fa-solid fa-plane-departure"></i> -->
                  Cancel Date
                </Button>
              </ButtonGroup>

            
            
          <!-- </AccordionItem> -->

        {/each}
      <!-- </Accordion> -->
      <!-- {/if} -->
    {/if}

    

    

</div>

<Modal title= { modalRoute.train_uid } bind:open={ openRouteViewModal } { size } { color } autoclose>
  <div transition:fly={{ delay: 200, duration: 300, x: 100, y: 500, opacity: 0.5}}>
    <Timeline order="vertical" class = "border-rose-600 font-bold">
      <TimelineItem title={ modalRoute.routes[0].start } date={  new Date(  modalRoute.routes[0].date ).toLocaleDateString()  }>
        <svelte:fragment slot="icon">
          <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
            
            <i class="fa-solid fa-train w-3 h-3 text-primary-600 dark:text-primary-400" ></i>

          </span>
        </svelte:fragment>
        <p class=" text-base font-bold text-gray-500 dark:text-gray-400">{ modalRoute.routes[0].departure_time }</p>
        <!-- <p class=" text-base font-bold font-serif text-gray-500 dark:text-gray-400">{ modalRoute.flight_id }</p> -->
        
      </TimelineItem>

      { #if modalRoute.routes.length != 0 }

        { #each modalRoute.routes as route,index }

          {#if index != 0 && index != modalRoute.routes.length-1 }

            <TimelineItem title={ route.start } date={ convertToLocalDate(new Date(route.date)) }>
              <svelte:fragment slot="icon">
                <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
              
                  <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>

                </span>
              </svelte:fragment>
              <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> { route.departure_time } </p>
              <!-- <p class=" text-base font-bold font-serif text-gray-500 dark:text-gray-400"> { transit.flight_id } </p> -->
              
            </TimelineItem>

          {/if }

        { /each }

      {/if}
      

      <TimelineItem title={ modalRoute.routes[modalRoute.routes.length-1].start } date={ new Date(modalRoute.routes[modalRoute.routes.length-1].date).toLocaleDateString() }>
        <svelte:fragment slot="icon">
          <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
          
            <i class="fa-solid fa-train w-3 h-3 text-primary-600 dark:text-primary-400" ></i>
          
          </span>
        </svelte:fragment>
        <p class="text-base font-bond text-gray-500 dark:text-gray-400"> { modalRoute.routes[modalRoute.routes.length-1].departure_time } </p>
      </TimelineItem>

    </Timeline>
  </div>
</Modal>

<Modal title="Routine Schedular" bind:open={schedularModal} autoclose={false} size="sm">
  <div class="flex flex-col space-y-4">
    <div class="flex flex-col space-y-4">
      <Label for="schedule" class="mb-2">Number of Schedule</Label>
      <Input type="number" bind:value={iter} id="schedule" placeholder="Enter NUmber of SChedule" required />
    </div>
    <div class="flex flex-col space-y-4">
      <Label for="interval" class="mb-2">Interval</Label>
      <Input type="number" bind:value={interval} id="interval" placeholder="Enter interval" required />
    </div>
  </div>
  <div class="flex-justify-content">
    <Button class="mx-96 bg-blue-500 hover:bg-blue-700 rounded-lg" on:click={()=>schedular(iter,interval,index)}>Submit</Button>
  </div>
</Modal>


<Modal bind:open={schedModal} size="xs" autoclose={false} class="w-full">
  <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Available Tickets</h3>
    {#each ticketData as tickets,idx}
      <Label class="grid grid-cols-2 space-y-py">
        <div class="flex-justify-content grid grid-cols-2">
          <Badge rounded color="gray-200" class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold w-fit bg-gray-300 border-black">

            <span class="">{tickets.coach}</span>
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 5a2 2 0 0 0-2 2v2.5c0 .6.4 1 1 1a1.5 1.5 0 1 1 0 3 1 1 0 0 0-1 1V17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2.5a1 1 0 0 0-1-1 1.5 1.5 0 1 1 0-3 1 1 0 0 0 1-1V7a2 2 0 0 0-2-2H4Z"/>
            </svg>
          </Badge>
          <!-- <svg class="w-32 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M7 6c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M2 11c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clip-rule="evenodd"/>
            <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
          </svg> -->
        </div>
        <Input id="disabled-input" disabled value ={tickets.available}  required/>
      </Label>
    {/each}
    <!-- <Button type="submit" class="w-full1 bg-gray-300" on:click={()=>}>Go Back</Button> -->
</Modal>

<!-- write a modal for update with email box -->
<Modal bind:open={updateModal} size="sm" autoclose={false}>
<!-- input field for text -->
  <Card class="addsched shadow-lg space-y-2" size="md" style="background-color:#ffffee">
      <Timeline order="vertical" class = "border-rose-600 font-bold event fade-in">

          { #each modalRoute.routes as stoppage,idx }
          <div class="flex-justify-content grid grid-cols-3 space-x-px">

              <TimelineItem title={ stoppage.start } date="">
                  <svelte:fragment slot="icon">
                  <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
                      <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>
                  </span>
                  </svelte:fragment>
                  <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> &nbsp; </p>                        
                  
              </TimelineItem>
              <div class="flex flex-col space-y-4">
                <Input type="date" bind:value={schedInfo[idx].date} id="date" required />
              </div>
              <div class="flex flex-col space-y-4">
                <Input type="time" bind:value={schedInfo[idx].departure_time} id="time"  required />
              </div>
          </div>
          { /each }

      </Timeline>
      <div class="space-y-3">
        {#if modalRoute.booking == 0}
          <Checkbox color="green" class= "" on:click={()=>booking = 1}>Booking</Checkbox>
        {:else}
          <Checkbox checked color="green" on:click={()=>booking = 0}>Booking</Checkbox>
        {/if}
        <div class="flex flex-col space-y-4">
          <Label for="textarea-id" class="mb-2">Your message</Label>
          <Textarea id="textarea-id" placeholder="Write your message here" rows="4" name="message" bind:value={msg} />
        </div>
      </div>
      
      <div class="space-y-3">

      </div>

        <div class="flex-justify-content grid-cols-2">
          <Button outline color="dark" class= "flex-justify-content rounded-l-md rounded-r-md" on:click={()=>updateSChed(modalRoute.schedule_id)}>
            Update Sched
          </Button>
      </div>

  </Card>
</Modal>

