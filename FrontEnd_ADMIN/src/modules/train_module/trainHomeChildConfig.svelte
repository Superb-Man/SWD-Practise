<script>
	import { routes } from './../../routes.ts';

    import { NavLi, Select,NavUl, GradientButton, ButtonGroup,Navbar} from 'flowbite-svelte'
    import { Card } from 'flowbite-svelte'
    import { Badge } from 'flowbite-svelte'
    import { Button, Modal, Label, Input, Checkbox, Timeline } from 'flowbite-svelte';
    import { ClockSolid, FireOutline } from 'flowbite-svelte-icons';
    import { seatType, trainlines } from '../../data/train_details';
    import { add, compareAsc } from 'date-fns';
    import { dummystationList, stationList } from "../../data/train_details"
    import {TimelineItem} from 'flowbite-svelte'
    import {Footer, FooterLink, FooterLinkGroup, FooterCopyright} from 'flowbite-svelte'
    import { onMount } from 'svelte';
    import { getAllCoaches } from '../../api/trainAdmin/trainGet';
    import { getRoutes } from '../../api/trainAdmin/trainGet';
    import {addDetails} from '../../api/trainAdmin/trainPost'
    import {addRoutes,deleteRoutes,updateRoutes} from '../../api/trainAdmin/trainPost'

    let train = window.sessionStorage.getItem("selected") ;

    let newSeatType = [] ;
    let passwordGiven ;
    let password = "password"
    let coachIndex = '' ,routeIndex ;
    let routeButton = false ;

    let coach ;
    let rows = '', columns = '' ,compartments ='' ;
    let customized = 'pl-60'
    let added_coach = false ;
    if(added_coach === false){
      customized = 'left-1/2'
    }
    let namesofCompartment = ['KA','KHA','GA','GHA','NGA','CHA','CHHA','JA','JHA','NYA','TA','THA','DA','DHA','NA','TA','THA','DA','DHA','NA','PA','PHA','BA','BHA','MA','YA','RA','LA','WA','SHA','SSA']

    let data = {
      train_uid : train ,
      coaches : [] ,
      dimensions : [] ,
      routes :[[],[]] ,
      route_id : [] ,
    } ;

    //#####################//////
    async function todo(){
      let response = await getAllCoaches(train);
      console.log(response)
      if(!response.ok){
        console.log("error")
        return
      }
      if(response.status != 200){
            console.log("no routes found") ;
            return ;
      }
      let res = await response.json();
      //map data dimensions and coaches using map
      
      data.coaches = res.coaches ;
      data.dimensions = res.dimensions ;

      //getRoutes
      let response2 = await getRoutes(train) ;
      if(!response2.ok){
          console.log("error") ;
          return ;
      }
      if(response2.status != 200){
          console.log("no routes found") ;
          return ;
      }
      let res2 = await response2.json() ;
      console.log(res2) ;
      // data.routes = res2.routes
      for(let i = 0 ; i< res2.length ; i++){
        data.routes[i] = res2[i].routes ;
        data.route_id.push(res2[i].id) ;
        trainstationList[i] = data.routes[i].map(f=>f.start) ;
        routeSize[i] = trainstationList[i].length ;
        trainstationList[i] = ['',...trainstationList[i].slice()]
      }
      console.log(trainstationList) ;
      console.log(data) ;
      console.log('Lara')

      remainingCoachInfo() ;

      console.log("Mounted")
      console.log(data)
    }
    onMount( async() => {
      await todo()
    }) ;

    //POST req
    async function updateCoachInfo() {
      let newData = {
        train_uid : train ,
        coaches : data.coaches,
        dimensions : data.dimensions,
      }
      let response = await addDetails(newData) ;
      if(!response.ok){
        console.log("error") ;
        console.log(response.status) ;
        return ;
      }
      if(response.status != 200){
            console.log("no routes found") ;
            return ;
      }
      console.log("Updating Coach Info")
      console.log(data)
    }

    //POST req
    async function modifyRoute(idx) {
      let response ;
      if(routeSize[idx] == 0 && data.routes[idx].length ==0 ){
        return ;
      }
      else if(routeSize[idx] == 0) {
        let newData = {
          train_uid : train ,
          routes : data.routes[idx] 
        }
        response = await addRoutes(newData) ;
        todo() ;
        if(!response.ok){
          console.log("error") ;
          console.log(response.status) ;
          return ;
        }
        if(response.status != 200){
              console.log("no routes found") ;
              return ;
        }
        routeSize[idx] = data.routes[idx].length ;
      }

      else if(data.routes[idx].length == 0) {
        response = await deleteRoutes(data.route_id[idx]) ;
        todo()
        if(!response.ok){
          console.log("error") ;
          console.log(response.status) ;
          return ;
        }
        if(response.status != 200){
              console.log("no routes found") ;
              return ;
        }
        routeSize[idx] = 0 ;
      }

      else {
        let newData = {
          id : data.route_id[idx],
          train_uid : train ,
          routes : data.routes[idx]
        }
        response = await updateRoutes(newData) ;
        todo()
        if(!response.ok){
          console.log("error") ;
          console.log(response.status) ;
          return ;
        }
        if(response.status != 200){
              console.log("no routes found") ;
              return ;
        }
        routeSize[idx] = data.routes[idx].length ;
      
      }
    }
    //#######################/

    // let data = {
    //     train_uid : "Agnibina-735",
    //     coaches : ["SHOVAN","SHULAV","AC_S"] ,
    //     dimensions: [[6,4,4],[6,5,4],[6,5,4]] ,
    //     routes : [
    //                 {
    //                     "start": "Rajshahi",
    //                     "departure_time": "10:00:00",
    //                     "cost_class": [
    //                     400,
    //                     200,
    //                     350,
    //                     ]
    //                 },
    //                 {
    //                     "start": "NarayanGanj",
    //                     "departure_time": "11:00:00",
    //                     "cost_class": [
    //                     0,
    //                     0,
    //                     0,
    //                     ]
    //                 }
    //                 ],
        
        
    // }
    let size = data.coaches.length ;

    

    console.log(seatType)

    //storing the coachindex
    function store(coach_idx,isaddComaprtments) {
      console.log("Storing",coach_idx)
      coachIndex = coach_idx ;
      //ternary operator to set compartment_modal or delete_coach_Modal
      isaddComaprtments ? compartments_modal = true : delete_coach_modal = true ;
      rows = columns = compartments = passwordGiven = coach = ""  ;

    }

    //adding comapartments
    let compartments_modal = false ;
    async function addComaprtments(coach_idx) {
      console.log(passwordGiven) ;
        //make an authentication chechking 
        /**
         * 
        */
       //raw for now
        if(password.localeCompare(passwordGiven)===0){
          console.log("Adding Comaprtments",coach_idx)
          data.dimensions[coach_idx][0] = compartments ;
          await updateCoachInfo() ;
          compartments_modal = false ;
          rows = columns = compartments = passwordGiven = coach = ""  ;

        }
    }


    //adding new coach
    let add_coach_modal = false ;
    async function addCoach() {
        // event.preventDefault();
        if(password.localeCompare(passwordGiven)===0){
          console.log("Adding Coach")
          data.coaches.push(coach) ;
          data.dimensions.push([rows,columns,compartments]) ;
          await updateCoachInfo() ;
          console.log(data.coaches) ;
          rows = columns = compartments = passwordGiven = coach = ""  ;
          add_coach_modal = false ;
          remainingCoachInfo() ;
        }

    }

    //deleting coach
    let delete_coach_modal = false ;
    async function deleteCoach(coach_idx) {
      console.log
      if(password.localeCompare(passwordGiven)===0){
        console.log("Deleting Coach",coach_idx)
        data.coaches.splice(coach_idx,1) ;
        data.dimensions.splice(coach_idx,1) ;
        await updateCoachInfo() ;
        delete_coach_modal = false ;
        rows = columns = compartments = passwordGiven = coach = ""  ;
        remainingCoachInfo() ;
      }
    }

    //remaining coachInfo
    console.log(seatType)
    function remainingCoachInfo() {
      rows = columns = compartments = coach = '';

      console.log("Remaining Coach Info")
      newSeatType = [] ;
      seatType.forEach(f=>{
        let found = false ;
        data.coaches.forEach(e => {
          if(f.value.localeCompare(e) === 0){
            found = true ;
          }
        });
        if(found === false){
          newSeatType.push(f) ;
        }
      }) ;
      return newSeatType ;
    }

    remainingCoachInfo() ;

    console.log(coach)

    /**
     * Route addition
     */

    //route addition info
    let Route = [[''],['']],trainstationList = [[''],['']] 
    let showList = stationList ;
    let addRouteCost = false ;
    let routeSize = [0,0] ;

    //cost class info
    let cost_class = [[]] ;
    //map the cost class
    for(let i = 0 ; i < data.routes.length ; i++){
      cost_class[i] = data.routes[i].map(f=>f.cost_class) ;
    }

    //export let option = "routes


    function addRoute(i,idx){
      console.log(Route)
      trainstationList[i].splice(idx+1,0,Route[i][idx])
      data.routes[i].splice(idx,0,{
        date : "",
        start: Route[i][idx],
        departure_time: "00:00:00",
        cost_class: [0,0,0]
      })
      // await modifyRoute() ;
      console.log(data)

      trainstationList[i] = trainstationList[i]
      remainingStations() ;

      return;

      //Route = []
      //window.location.reload()

    }

    function removeRoute(i,idx) {
      console.log(idx)
      //remove an elemnt by index
      trainstationList[i].splice(idx,1)
      data.routes[i].splice(idx-1,1) 
      // await modifyRoute() ;
      trainstationList[i] = trainstationList[i]
      
      console.log(trainstationList[i])
      remainingStations() ;
    }

    function remainingStations() {
      // showList = [] ;
      // stationList.forEach(f=>{
      //   let found = false ;
      //   trainstationList.forEach(e => {
      //     if(f.value.localeCompare(e) === 0 && e.localeCompare('') !== 0){
      //       found = true ;
      //     }
      //   });
      //   if(found === false){
      //     showList.push(f) ;
      //   }
      // }) ;
      // return showList ;
    
    }
    remainingStations() ;

    let modalInfo

    function setRouteCostVisibility(i,idx) {
      addRouteCost = true ;
      modalInfo = {
        start : trainstationList[i][idx],
        end : trainstationList[i][trainstationList[i].length-1] ,
        cost_class : data.routes[i][idx-1].cost_class,
        idx : idx-1 ,
        id : i 
      }
    }



    function setNewRouteCost(i,idx) {
      console.log(modalInfo)
      data.routes[i][modalInfo.idx].cost_class = modalInfo.cost_class ;
      // await modifyRoute() ;
      addRouteCost = false ;
      console.log(data) ;
    }
  
</script>

<div class="space-x-8 space-y-8">
    <Card class = "shadow-none flex-justify-content" size = "xl">
        <h1>
            {data.train_uid}
        </h1>
        <!-- draw card of all the classes in scrpits horizontally having 3 -->
        <div class = "grid grid-cols-3 mx-8 my-8 h-auto">
            {#each Array(data.coaches.length) as _,coach_idx}
              <div class="px-8 py-8">
                  <Card class = "shadow-lg flex-justify-content" size = "md" style="background-color:#ffffee">
                      <Badge rounded color="gray" class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold w-fit bg-gray-300 border-black">
                          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4 5a2 2 0 0 0-2 2v2.5c0 .6.4 1 1 1a1.5 1.5 0 1 1 0 3 1 1 0 0 0-1 1V17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2.5a1 1 0 0 0-1-1 1.5 1.5 0 1 1 0-3 1 1 0 0 0 1-1V7a2 2 0 0 0-2-2H4Z"/>
                          </svg>
                          <h3 class= "text-left flex-justify-content">
                              <b>{data.coaches[coach_idx]} Coach</b>
                          </h3>
                      </Badge>
                      <h2 class= "text-left flex-justify-content"><b>Rows : {data.dimensions[coach_idx][2]}</b></h2>
                      <h2 class= "text-left flex-justify-content"><b>Columns : {data.dimensions[coach_idx][1]}</b></h2>
                      <h2 class= "text-left flex-justify-content"><b>Compartments : {data.dimensions[coach_idx][0]}</b></h2>
                      <h2 class= "text-left flex-justify-content"><b>Total seats : {data.dimensions[coach_idx][0]*data.dimensions[coach_idx][1]*data.dimensions[coach_idx][2]}</b></h2>
                      <div class="grid grid-cols-2">
                        <Button color="light" pill class="mx-8 items-end rounded-xl transition duration-150 ease-in-out" size ="sm" on:click={()=>store(coach_idx,true)}>Edit</Button>
                        <Button color="light" pill class="mx-8 items-end rounded-xl transition duration-150 ease-in-out" size ="xs" 
                                                         on:click={()=>store(coach_idx,false)}>
                                                                                                      
                          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
                          </svg>
                        </Button>
                      </div>
                      <Modal bind:open={delete_coach_modal} size="xs" autoclose={false} class="w-full">
                          <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Remove Coach</h3>
                          <Label class="space-y-2">
                            <span>Your password to verify</span>
                            <Input id="password" bind:value = {passwordGiven} type="password" name="password" placeholder="•••••" required/>
                          </Label>
                          <Button type="submit" class="w-full1 bg-gray-300" on:click={()=>deleteCoach(coachIndex)}>Update info</Button>
                      </Modal>
                        <Modal bind:open={compartments_modal} size="xs" autoclose={false} class="w-full">

                            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">New Comapartment</h3>
                            <Label class="space-y-2">
                              <span>Compartment</span>
                              <Input id={coachIndex} bind:value={compartments} type="number" name="Compartments" placeholder={data.dimensions[coachIndex][0]} required />
                            </Label>
                            <Label class="space-y-2">
                              <span>Your password to verify</span>
                              <Input id="password" bind:value = {passwordGiven} type="password" name="password" placeholder="•••••" required/>
                            </Label>
                            <Button type="submit" class="w-full1 bg-gray-300 transition duration-150 ease-in-out ..." on:click={()=>addComaprtments(coachIndex)}>Update info</Button>

                        </Modal>

                    
                  </Card>
              </div>
            {/each}

            <div class="px-8 py-8">
              <Card class = "shadow-lg flex-justify-content dark:md hover:rounded cursor-pointer transition transform hover:-translate-y-1 motion-reduce:transition-shadow motion-reduce:hover:transform-none ..." size = "sm"
              on:click={()=>add_coach_modal = true}>
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm11-4.2a1 1 0 1 0-2 0V11H7.8a1 1 0 1 0 0 2H11v3.2a1 1 0 1 0 2 0V13h3.2a1 1 0 1 0 0-2H13V7.8Z" clip-rule="evenodd"/>
                    </svg>
                    <h3 class= "text-left flex-justify-content">
                        <b>Add Coach</b>                
              </Card>
              <Modal bind:open={add_coach_modal} size="xs" autoclose={false} class="w-full">

                    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">New Coach info</h3>
                    <div class = "w-fit items-center grid grid-cols-2 space-x-8">

                      <Select items= {newSeatType} bind:value = {coach} id="text" class = " mr-8 pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-gray-200 cursor-pointer flex-justify-content"
                      placeholder = "Coach" />
                      <!-- <Select items= { seatType } id="text" bind:value = { coach } class = " mx-8 pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-gray-400 cursor-pointer "    /> -->
                  
                    </div>
                    <Label class="space-y-2">
                      <span>Rows</span>
                      <Input id="rows" bind:value={rows} type="number" name="rows" placeholder="place your row" required />
                    </Label>
                    <Label class="space-y-2">
                      <span>Columns</span>
                      <Input id="columns" bind:value={columns} type="number" name="columns" placeholder="place your column" required />
                    </Label>
                    <Label class="space-y-2">
                      <span>Compartments</span>
                      <Input id="compartments" bind:value={compartments} type="number" name="compartments" placeholder="place your compartments" required />
                    </Label>
                    <Label class="space-y-2">
                      <span>Your password to verify</span>
                      <Input id="password" bind:value={passwordGiven} type="password" name="password" placeholder="•••••" required />
                    </Label>
                    <Button type="submit" class="w-full1 bg-gray-300" on:click={()=>addCoach()}>Update info</Button>

              </Modal>
            </div>
        

        </div>
    </Card>
    <!-- <Card size = "xl" class="shadow-none flex-justify-content h-auto"> -->
        <!-- <div class="grid grid-cols-2 mx-8 my-8 h-auto"> -->
            <div class = "w-full mt-8 left-1/4 absolute h-fit">
  
              <Card class="shadow-lg" size="md" style="background-color:#ffffee">
      
              <h2 class = "font-bold text-left mb-8 font-serif" > Route-1 </h2>
                  <Timeline order="vertical" class = "border-rose-600 font-bold event fade-in">
      
                      { #each trainstationList[0] as stoppage,idx }
                      <div class="flex-justify-content grid grid-cols-2">
      
                          <TimelineItem title={ stoppage } date="">
                              <svelte:fragment slot="icon">
                              <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
                                {#if idx != 0}
                                  <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>
                                {/if}
                              </span>
                              </svelte:fragment>
                              <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> &nbsp; </p>
                                <Select items= { showList } id="text" placeholder = "Add" bind:value = { Route[0][idx] } class = "mx-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 w-40 rounded-lg hover:bg-green-200 cursor-pointer flex-justify-content"  on:change = { () => addRoute(0,idx) } />
                              
                              
                          </TimelineItem>
                            {#if idx != 0}
                              <!-- <div class="grid grid-cols-2 flex-justify-content w-auto"> -->
                                <p>
                                <ButtonGroup class="space-x-px" size="sm">
                                  <Button class="rounded-none hover:bg-red-500" size="sm" on:click={()=>removeRoute(0,idx)}>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
                                    </svg>
                                  </Button>
                                  <Button class="rounded-none flex-justify-content hover:bg-green-300" size="sm" on:click={()=>setRouteCostVisibility(0,idx)} >
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                      <path fill-rule="evenodd" d="M7 6c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z" clip-rule="evenodd"/>
                                      <path fill-rule="evenodd" d="M2 11c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clip-rule="evenodd"/>
                                      <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                                    </svg>
                                    <!-- Create a modal -->
                                                                        
                                  </Button>
                                </ButtonGroup>
                                </p>
                              <!-- </div>   -->
                            {/if}
                      </div>
                      { /each }
      
                  </Timeline>
                  <div class="w-96">
                    <Button class="mx-96 bg-green-500 hover:bg-green-700 rounded-lg" on:click={()=>modifyRoute(0)}>Submit</Button>
                  </div>
      
              </Card>
              
      
          </div>
      
          <div class = "w-full mt-8 left-2/3 absolute h-fit">
            <Card class="shadow-lg" size="md" style="background-color:#ffffee">
      
              <h2 class = "font-bold text-left mb-8 font-serif" > Route-1 </h2>
                  <Timeline order="vertical" class = "border-rose-600 font-bold event fade-in">
      
                      { #each trainstationList[1] as stoppage,idx }
                      <div class="flex-justify-content grid grid-cols-2">
      
                          <TimelineItem title={ stoppage } date="">
                              <svelte:fragment slot="icon">
                              <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
                                {#if idx != 0}
                                  <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>
                                {/if}
                              </span>
                              </svelte:fragment>
                              <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> &nbsp; </p>
                                <Select items= { showList } id="text" placeholder = "Add" bind:value = { Route[1][idx] } class = "mx-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 w-40 rounded-lg hover:bg-green-200 cursor-pointer flex-justify-content"  on:change = { () => addRoute(1,idx) } />
                              
                              
                          </TimelineItem>
                            {#if idx != 0}
                              <!-- <div class="grid grid-cols-2 flex-justify-content w-auto"> -->
                                <p>
                                <ButtonGroup class="space-x-px" size="sm">
                                  <Button class="rounded-none hover:bg-red-500" size="sm" on:click={()=>removeRoute(1,idx)}>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
                                    </svg>
                                  </Button>
                                  <Button class="rounded-none flex-justify-content hover:bg-green-300" size="sm" on:click={()=>setRouteCostVisibility(1,idx)} >
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                      <path fill-rule="evenodd" d="M7 6c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z" clip-rule="evenodd"/>
                                      <path fill-rule="evenodd" d="M2 11c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clip-rule="evenodd"/>
                                      <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                                    </svg>
                                    <!-- Create a modal -->
                                                                        
                                  </Button>
                                </ButtonGroup>
                                </p>
                              <!-- </div>   -->
                            {/if}
                      </div>
                      { /each }
      
                  </Timeline>
                  <div class="w-96">
                    <Button class="mx-96 bg-green-500 hover:bg-green-700 rounded-lg" on:click={()=>modifyRoute(1)}>Submit</Button>
                  </div>
      
              </Card>
      
          
      
          </div>
        <!-- </div> -->
    <!-- </Card> -->
 
</div>

<Modal bind:open={addRouteCost} size="xs" autoclose={false} class="w-full">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{modalInfo.start} to {modalInfo.end}</h3>
      {#each data.coaches as coach,idx}
        <Label class="grid grid-cols-2 space-y-py">
          <div class="flex-justify-content grid grid-cols-2">
            <Badge rounded color="gray-200" class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold w-fit bg-gray-300 border-black">

              <span class="">{coach}</span>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 5a2 2 0 0 0-2 2v2.5c0 .6.4 1 1 1a1.5 1.5 0 1 1 0 3 1 1 0 0 0-1 1V17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2.5a1 1 0 0 0-1-1 1.5 1.5 0 1 1 0-3 1 1 0 0 0 1-1V7a2 2 0 0 0-2-2H4Z"/>
              </svg>
            </Badge>
            <svg class="w-32 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M7 6c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M2 11c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clip-rule="evenodd"/>
              <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
            </svg>
          </div>
          <Input id="cost" bind:value = {modalInfo.cost_class[idx]} type="number" name="cost" placeholder={modalInfo.cost_class[idx]}  required/>
        </Label>
      {/each}
      <Button type="submit" class="w-full1 bg-gray-300" on:click={()=>setNewRouteCost(modalInfo.id,modalInfo.idx)}>Update info</Button>
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


<!-- add style for first card to cream -->