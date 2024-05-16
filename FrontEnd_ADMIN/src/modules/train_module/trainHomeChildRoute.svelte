<script>

    import { onMount } from "svelte"

    import { dummystationList, stationList } from "../../data/train_details"

    import { Card, Select, TimelineItem, Timeline } from "flowbite-svelte"

    import { PlusOutline } from "flowbite-svelte-icons"
    import { Footer, FooterLink, FooterLinkGroup, FooterCopyright } from "flowbite-svelte"
    import {fade, fly} from 'svelte/transition'
    import {getRoutes} from '../../api/trainAdmin/trainGet'


    // let train = []

    // const url = new URL(window.location.href)

    // const pathsegments = url.hash.split('/').filter(Boolean)

    // console.log(pathsegments)

    let train = window.sessionStorage.getItem("selected")

    let Route = [], trainstationList = [[],[]]

    //export let option = "route"

    //get routes of a train
    onMount( async() => {
        const response = await getRoutes(train) ;
        if(!response.ok){
            console.log("error") ;
            return ;
        }
        if(response.status != 200){
            console.log("no routes found") ;
            return ;
        }
        let data = await response.json() ;
        console.log(data.length) ;
        console.log(train) ;
        for(let i = 0 ; i < data.length ; i++){
            trainstationList[i] = data[i].routes.map(f=>f.start) ;
        }

    }) ;

    function custom(){
        // return {
        //     css:(t,u)=> 'transform:translatex(${u*200px})',
        // }
    }

    // trainstationList = dummystationList

    console.log(trainstationList) 
    // function fade(
    //     node: Element,
    //     { delay, duration, easing }?: FadeParams | undefined
    // ): TransitionConfig;

</script>

<div class = "container"  >

    <h1 class = "font-bold text-center " > { train } </h1>

    <div class = "w-full mt-8 left-1/4 absolute h-fit" >

        <Card style="background-color:#ffffee">
            <div transition:custom>

                <h2 class = "font-bold text-left mb-8 font-serif" > Route-1 </h2>


                <Timeline order="vertical" class = "border-rose-600 font-bold event fade-in">

                    { #each trainstationList[0] as stoppage,idx }

                    <TimelineItem title={ stoppage } date="">
                        <svelte:fragment slot="icon">
                        <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
                        
                            <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>

                        </span>
                        </svelte:fragment>
                        <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> &nbsp; </p>
                        
                        
                        <!-- <Select items= { stationList } id="text" placeholder = "add route" bind:value = { Route[idx] } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 w-1/2 rounded-lg hover:bg-green-200 cursor-pointer "  on:change = { () => addRoute(idx) } /> -->

                        
                        
                    </TimelineItem>
                    { /each }

                </Timeline>
            </div>

        </Card>

    </div>

    <div class = "w-full mt-8 left-2/3 absolute h-fit">

        <Card style="background-color:#ffffee">

            <h2 class = "font-bold text-left mb-8 font-serif" > Route-2 </h2>


            <Timeline order="vertical" class = "border-rose-600 font-bold">

                { #each trainstationList[1] as stoppage }

                <TimelineItem title={ stoppage} date="">
                    <svelte:fragment slot="icon">
                    <span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-50 rounded-full ring-8 ring-blue-50">
                    
                        <i class="fa-solid fa-map-marker-alt w-3 h-3 text-green-600 dark:text-green-400" ></i>

                    </span>
                    </svelte:fragment>
                    <p class=" text-base font-bold text-gray-500 dark:text-gray-400"> &nbsp; </p>
                </TimelineItem>
                { /each }

            </Timeline>

        </Card>

    

    </div>

</div>