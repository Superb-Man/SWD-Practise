<script>

    import { Alert, Button, ButtonGroup } from "flowbite-svelte"

    import { AdjustmentsVerticalOutline } from "flowbite-svelte-icons";

    import { AccordionItem, Accordion, Avatar, Badge, Card, Timeline, TimelineItem } from 'flowbite-svelte';

    //import { air_lines } from "../../data/user_ticket_history";

    import { airHistoryApi, trainHistoryApi } from "../../api/historyApi";
    import { routes } from "../../routes";
    //import { histories } from "../../data/user_ticket_history";
    //import { air_line } from "../../data/airline_query";

    let histories = [];
    let air_histories = [], bus_histories = [], train_histories = [];
    let type = ""
    let idx = 0 ;

    async function air_history(){
      histories = []

      type = "air";

      let jsonData = {
    
        "user_name" : window.localStorage.getItem("username"), 
        "accesstoken" : window.localStorage.getItem( window.localStorage.getItem("username") ),
        

      };

      const formData = JSON.stringify(jsonData)

      const response = await airHistoryApi( formData )

      air_histories = await response.json();

      let status = response.status

      if(status == 400){

        localStorage.clear();
      }

      histories = air_histories;

      console.log(histories)

      
    
    }

    async function train_history(){
      console.log('here') 

      type = "train";
      histories = []

      let jsonData = {

      "user_name" : window.localStorage.getItem("username"), 
      "accesstoken" : window.localStorage.getItem( window.localStorage.getItem("username") ),
  

    };

    const formData = JSON.stringify(jsonData)

    const response = await trainHistoryApi( formData )

    train_histories = await response.json();

    let status = response.status

    if(status == 400){

      localStorage.clear();
    }

    histories = train_histories;

    console.log(histories)

    

}
      


</script>



<div class="max-w-2xl w-fit space-y-5" >

    <ButtonGroup >
      <Button outline color="dark" class= " rounded-l-md rounded-r-none" on:click = { () => air_history() }>
        
        <i class="fa-solid fa-plane me-2"></i>
        Flight History
      </Button>
      <Button outline color="dark" class= "  rounded-none" on:click={()=>histories = []}>
        <i class="fa-solid fa-bus me-2"></i>
        Bus or Coach Ticket History
      </Button>
      <!-- <Button outline color="dark" class= "  rounded-none " on:click = { () => train_history() } >
        <i class="fa-solid fa-train me-2"></i> 
        Train Ticket History
      </Button> -->
      <!-- <Button outline color="dark" class= " rounded-none " >
        <i class="fa-solid fa-ship me-2"></i>
        Launch Ticket History
      </Button> -->
      <Button outline color="dark" class= " rounded-r-md rounded-l-none " on:click = { () => train_history() } >
              
        <AdjustmentsVerticalOutline class="w-3 h-3 me-2" />
        <!--Show All History -->

        Train Ticket History
      </Button>
    </ButtonGroup>

    {#if window.localStorage.username === undefined} 

    

        <Alert>

            <span class="font-medium">Sorry!</span>
            You have to sign in first 

        </Alert>

    { :else if histories.length === 0 }

        <Alert>

            <span class="font-medium">Sorry!</span>
            You have no recent tickets 

        </Alert>

    {:else }

      

      <Accordion>

        { #each histories as history }

          { #if type === "air" }

            <AccordionItem class= "w-fit md:w-full">

              <span slot="header" class = " md:flex items-center font-serif font-bold " >

                <span class="flex-1 text-center">{ history.flight_id }</span>
                <div class="md:flex-1 h-0 md:w-24 border-b border-black"></div>
                <span class="flex-1 text-center">{ history.from_port }</span>
                <div class="md:flex-1 lg:flex-2 h-0 md:w-24 lg:w-48 border-b border-black"></div>
                <span class="flex-1 text-center">{ history.to_port }</span>
                <div class="md:flex-1 h-0 md:w-24 lg:w-24 border-b border-black"></div>
                <span class="flex-2 text-center">{ new Date(history.departure_date).toLocaleDateString() }</span>

              </span>
              <div slot="arrowup">
                <i class="fa-solid fa-caret-up h-3 w-3 -me-2"></i>
              </div>
              <span slot="arrowdown">
                <i class="fa-solid fa-caret-down h-3 w-3 -me-2"></i>
              </span>

              <Card horizontal size = "xl" class = "bg-gray-200 w-fit relative cursor-pointer" padding = "md" >

                <div class = " border-r border-gray-400 justify-center w-32 md:w-28 lg:w-28 relative my-2 ">
                  <Avatar size="md" src = { "" } class = "ml-8"/>
                  <Badge color="yellow" class="mt-4 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ history.company_name }</Badge>
                  <Badge color="primary" class="mt-4 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative"> { history.flight_id } </Badge>
                </div>

              

                <div class = "  justify-center w-32 relative ">
                  <div class = " border-r border-gray-400 ">
                    <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold font-serif pb-12"> Source Port </p>

                    <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative">{ history.from_port }</p>
                    <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold ">{ history.departure_time }</p>
                    <p class="ml-1 mt-1 text-sm w-32 tracking-tight text-gray-900 dark:text-white relative font-bold">{ new Date(history.departure_date).toLocaleDateString() }</p>
                    
                  </div>
                </div>

                <!-- <div class = "my-auto relative w-96" > -->

                <!-- <Timeline order="horizontal" >
                  <TimelineItem title="direct" date="" >
    
                    <svelte:fragment slot="icon">
                      <div class="flex items-center">
                      
                        <div class="hidden sm:flex w-80 ml-6 bg-rose-600 h-0.5 dark:bg-gray-700" />
                      </div>
                    </svelte:fragment>
                    
    
                  </TimelineItem>

    
                </Timeline> -->

                <!-- </div> -->
                

                <div class = "justify-center w-32 relative  ">
                  <div class = " border-r border-gray-400 ">
                    <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold font-serif pb-12"> Dest. Port  </p>

                    <p class="mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative">{ history.to_port }</p>
                    <p color="green" class="mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold ">{ history.arrival_time }</p>
                    <p class="mt-1 text-sm w-32 tracking-tight text-gray-900 dark:text-white relative font-bold">{ new Date(history.arrival_date).toLocaleDateString() }</p>
                  </div>
                </div>

              

                

                <div class = " justify-center w-28 relative">

                  <div class = " border-r border-gray-400 ">

                    <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold font-serif "> Bill  </p>
                  
                    <p color="yellow" class="mt-1/2 text-md w-24 tracking-tight text-gray-900 dark:text-white relative mb-4">Tk : { history.amount }</p> 

                    <div class = "pb-3"></div>
                    
                    <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold font-serif "> Class  </p>
                  
                    <p color="yellow" class="mt-1/2 text-md w-24 tracking-tight text-gray-900 dark:text-white relative mb-4">{ history.class_name }</p> 
              
                  </div>
                
                </div>


                <div class = " justify-center w-24 relative my-auto">
                  
                  <p class="mt-1/2 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ history.seat_booked_string } </p>
                
                </div>

              

                
              </Card>

              
              
            </AccordionItem>

        {:else if type === "train"}  

        <AccordionItem class= "w-fit md:w-full">

          <span slot="header" class = " md:flex items-center font-serif font-bold " >

            <span class="flex-1 text-center">{ history.train_uid }</span>
            <div class="md:flex-1 h-0 md:w-24 border-b border-black"></div>
            <span class="flex-1 text-center">{ history.details.source }</span>
            <div class="md:flex-1 lg:flex-2 h-0 md:w-24 lg:w-48 border-b border-black"></div>
            <span class="flex-1 text-center">{ history.details.destination }</span>
            <div class="md:flex-1 h-0 md:w-24 lg:w-24 border-b border-black"></div>
            <span class="flex-2 text-center">{ new Date(history.routes[0].date).toLocaleDateString() }</span>

          </span>
          <div slot="arrowup">
            <i class="fa-solid fa-caret-up h-3 w-3 -me-2"></i>
          </div>
          <span slot="arrowdown">
            <i class="fa-solid fa-caret-down h-3 w-3 -me-2"></i>
          </span>

          <Card horizontal size = "xl" class = "bg-gray-200 w-fit relative cursor-pointer" padding = "md" >

            <div class = " border-r border-gray-400 justify-center w-32 md:w-28 lg:w-28 relative my-2 ">
              <Avatar size="md" src = { "" } class = "ml-8"/>
              <Badge color="yellow" class="mt-4 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative">{ history.company_name }</Badge>
              <Badge color="primary" class="mt-4 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative"> { history.train_uid } </Badge>
            </div>

          

            <div class = "  justify-center w-32 relative ">
              <div class = " border-r border-gray-400 ">
                <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold font-serif pb-12"> Source Port </p>

                <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative">{ history.details.source }</p>
                <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold ">{ history.routes[0].departure_time }</p>
                <!-- <p class="ml-1 mt-1 text-sm w-32 tracking-tight text-gray-900 dark:text-white relative font-bold">{ new Date(history.routes[0].departure_date).toLocaleDateString() }</p> --> -->
                
              </div>
            </div>

            <!-- <div class = "my-auto relative w-96" > -->

            <!-- <Timeline order="horizontal" >
              <TimelineItem title="direct" date="" >

                <svelte:fragment slot="icon">
                  <div class="flex items-center">
                  
                    <div class="hidden sm:flex w-80 ml-6 bg-rose-600 h-0.5 dark:bg-gray-700" />
                  </div>
                </svelte:fragment>
                

              </TimelineItem>


            </Timeline> -->

            <!-- </div> -->
            

            <div class = "justify-center w-32 relative  ">
              <div class = " border-r border-gray-400 ">
                <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold font-serif pb-12"> Dest. Port  </p>

                <p class="mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative">{ history.details.destination }</p>
                 <p color="green" class="mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold ">{ history.routes[ history.routes.length - 1 ].departure_time }</p>
                <!-- <p class="mt-1 text-sm w-32 tracking-tight text-gray-900 dark:text-white relative font-bold">{ new Date(history.arrival_date).toLocaleDateString() }</p>  -->
              </div>
            </div>

          

            

            <div class = " justify-center w-28 relative">

              <div class = " border-r border-gray-400 ">

                <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold font-serif "> Bill  </p>
              
                <p color="yellow" class="mt-1/2 text-md w-24 tracking-tight text-gray-900 dark:text-white relative mb-4">Tk : { history.amount }</p> 

                <div class = "pb-3"></div>
                
                <p class="ml-1 mt-1 text-sm w-28 tracking-tight text-gray-900 dark:text-white relative font-bold font-serif "> Class  </p>
              
                <p color="yellow" class="mt-1/2 text-md w-24 tracking-tight text-gray-900 dark:text-white relative mb-4">{ history.coach_name }</p> 
          
              </div>
            
            </div>


            <div class = " justify-center w-24 relative my-auto">
              
              <p class="mt-1/2 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold">{ history.seat_booked_string } </p>
            
            </div>

          

            
          </Card>

          
          
        </AccordionItem>

      


        {/if}

 



        {/each}
      </Accordion>
          
       

    {/if}

    

    

</div>

