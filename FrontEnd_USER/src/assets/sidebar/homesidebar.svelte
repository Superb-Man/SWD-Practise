<script>

    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { GridSolid, MailBoxSolid, TicketOutline, PrintSolid, ArrowRightFromBracketSolid, QuestionCircleOutline } from 'flowbite-svelte-icons';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import '@fortawesome/fontawesome-free/css/all.css';
    //import { writable } from 'svelte/store';
    //import { storeusername } from '../../store/store'/////////////////////
    
    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 bg-gray-200 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';
    let activeUrl =  window.location.pathname + window.location.hash

    let username = '';

    //storeusername.subscribe( uname => { username = uname })/////////////////////

    username = window.localStorage.getItem("username")

    console.log(activeUrl,username)

    let homepath = "/#/home/" + username

    let ticketpath = "/#/history/" + username




</script>

  <Sidebar {activeUrl} {activeClass} {nonActiveClass} {spanClass} class = "h-screen" >
    <SidebarWrapper class = "bg-gray-800 h-4/5 w-fit md:w-full">
      <SidebarGroup>



        <SidebarItem label="Dashboard" href =  "{homepath}"  >
          <svelte:fragment slot="icon">
            
            <GridSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

          </svelte:fragment> 
            
        </SidebarItem>

        


        <!-- <SidebarItem label="Inbox" >
          <svelte:fragment slot="icon">
            <MailBoxSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
          <svelte:fragment slot="subtext">
            <span class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"> 3 </span>
          </svelte:fragment>
        </SidebarItem> -->
        
        <SidebarItem label="Ticket History" href = "{ticketpath}">
          <svelte:fragment slot="icon">
            <TicketOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>

        <!-- <SidebarItem label="Print this page">
          <svelte:fragment slot="icon">
            <PrintSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem> -->

    </SidebarGroup>
    <SidebarGroup border>

        <!-- <SidebarItem label="Hotel Booking" >
          <svelte:fragment slot="icon">
            
            <i class="fa-solid fa-hotel"></i>

            </svelte:fragment>
          
        </SidebarItem> -->

        <!-- <svelte:fragment slot="subtext">
            <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" > Pro </span>
          </svelte:fragment> -->


        <SidebarItem label="Airplane" href="/#/airplane" >
          <svelte:fragment slot="icon">
              <i class="fa-solid fa-plane"></i>
          </svelte:fragment>
        </SidebarItem>


        <SidebarItem label="Bus" href="/#/bus" >
            <svelte:fragment slot="icon">

             <i class="fa-solid fa-bus"></i>
            
            </svelte:fragment>
        </SidebarItem>


        <SidebarItem label="Train" href="/#/train" >

            <svelte:fragment slot="icon">
              
              <i class="fa-solid fa-train"></i>
  
              </svelte:fragment>
            <!-- <svelte:fragment slot="subtext">
              <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" > Pro </span>
            </svelte:fragment> -->

        </SidebarItem>

        <!-- <SidebarItem label="Launch" >

            <svelte:fragment slot="icon">
              
              <i class="fa-solid fa-ship"></i>
  
              </svelte:fragment> -->
            <!-- <svelte:fragment slot="subtext">
              <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" > Pro </span>
            </svelte:fragment> -->
            
        <!-- </SidebarItem> -->

    </SidebarGroup>
    <SidebarGroup border>


        

        <!-- <SidebarItem label="Help">
            <svelte:fragment slot="icon">
            <QuestionCircleOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                
            </svelte:fragment>
        </SidebarItem>

        <SidebarItem label="Sign Out">
            <svelte:fragment slot="icon">
            <ArrowRightFromBracketSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                
            </svelte:fragment>
        </SidebarItem> -->


      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>

  