<script>

    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownWrapper, SidebarDropdownItem } from 'flowbite-svelte';
    import { GridSolid, PlusOutline, ListOutline, PrintSolid, SearchOutline, QuestionCircleOutline } from 'flowbite-svelte-icons';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import '@fortawesome/fontawesome-free/css/all.css';
    import { push } from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import { Modal, Button } from 'flowbite-svelte';
    import { Input } from 'flowbite-svelte';
    import { Label } from 'flowbite-svelte';
    import { Badge } from 'flowbite-svelte';
    
    // import trainAdminAPi from api folder
    import  {getAlltrains} from '../../api/trainAdmin/trainGet'
    import  {addTrain} from '../../api/trainAdmin/trainPost'
    import { add } from 'date-fns';
    //import { writable } from 'svelte/store';
    //import { storeusername } from '../../store/store'/////////////////////
    
    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-gray-200 bg-gray-800 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';
    let activeUrl =  window.location.pathname + window.location.hash
    //let active = true

    let username = '';
    let inp = ''
    let addModal = false;

    //storeusername.subscribe( uname => { username = uname })/////////////////////

    username = window.sessionStorage.getItem("username")

    console.log(activeUrl,username)

    let homepath = "/#/home/" + username

    let trainpath = "/#/home/" + username

    async function storeTrain(train){

      window.sessionStorage.setItem("selected", train)

      

      window.location.href = `${trainpath}/${train}/route`

      window.location.reload()
      
    }

    let trainList = [] ;
    addModal = false ;
    onMount( async() => {
      console.log(username)
      let response = await getAlltrains(username);
      if(!response.ok){
        console.log("error")
        return
      }
      if(response.status != 200){
            console.log("no routes found") ;
            return ;
        }
      // trainList = response.map( train => train.train_uid)
      trainList = await response.json()
      trainList = trainList.map( train => train.train_uid)
      console.log(trainList)
      inp = ' '
      

    })

    async function addition() {
      const response = await addTrain({company_name:username,train_uid:inp}) ;
      inp = '' ;
      if(!response.ok){
        console.log("error") ;
        return ;
      }
      if(response.status != 200){
        console.log("no routes found") ;
        return ;
      }
    }
</script>

  <Sidebar {activeUrl} {activeClass} {nonActiveClass} {spanClass} class = "h-screen" >
    <SidebarWrapper class = "bg-gray-300 h-fit w-fit md:w-full">
      <SidebarGroup>



        <SidebarItem label="Dashboard" href =  "{homepath}" class = "bg-gray-400" >
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
        
        
        <SidebarDropdownWrapper class = "flex items-center p-2 text-base font-normal text-gray-200 bg-gray-400 rounded-lg dark:text-white hover:bg-green-100 hover:text-blue-500 dark:hover:bg-green-700" label="Train List" >
          <svelte:fragment slot="icon">
            <ListOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
          {#each trainList as train_uid,idx}
            <SidebarDropdownItem  class = "flex items-center p-2 text-base font-normal text-gray-200 bg-gray-400 rounded-lg dark:text-white hover:bg-green-100 hover:text-blue-500 dark:hover:bg-green-700" label="{train_uid}" href = "{trainpath}/{train_uid}/route" on:click = { () => storeTrain(train_uid) } />
            <!-- <SidebarDropdownItem  class = "flex items-center p-2 text-base font-normal text-gray-200 bg-gray-400 rounded-lg dark:text-white hover:bg-green-100 hover:text-blue-500 dark:hover:bg-green-700" label="{train_uid}" href = "{trainpath}/{train_uid}/route" on:click = { () => storeTrain(train_uid) } /> -->
            <!-- <SidebarDropdownItem label="Invoice" /> -->
          {/each}
        </SidebarDropdownWrapper>
      
        <Button class = "flex items-center justify-start p-2 text-base w-full font-normal text-gray-200 bg-gray-400 rounded-lg dark:text-white hover:bg-green-100 hover:text-blue-500 dark:hover:bg-green-700" on:click ={()=> ( addModal = true ) } > 
          <!-- <svelte:fragment slot="icon"> -->
            <PlusOutline class="w-5 h-5 me-2 text-gray-800 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            
          <!-- </svelte:fragment> -->

          Add Train 
          <!-- <Input type="text" bind:value={inp} id="train_uid" class="flex-justify-content" required/>
          <Button class = "bg-black" on:click = {addition} >
            <svelte:fragment slot="icon">
              <PlusOutline class="w-5 h-5 text-gray-800 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </svelte:fragment>
          </Button> -->
        </Button>

        <!-- <SidebarItem label="Info" class = "bg-gray-400" >
          <svelte:fragment slot="icon">
            <PlusOutline class="w-5 h-5 text-gray-800 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem> -->

        

    </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>

  <!-- Add a modal with input field -->

  <Modal bind:open={addModal} size="xs" autoclose={false} class="w-full">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white bg-blur">Add New Train</h3>
          <div class="flex-justify-content grid grid-cols-2">
            <!-- <Badge rounded color="gray-200" class="ml-1 mt-1 text-sm w-24 tracking-tight text-gray-900 dark:text-white relative font-bold w-fit bg-gray-300 border-black">

              <span class="">{coach}</span>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 5a2 2 0 0 0-2 2v2.5c0 .6.4 1 1 1a1.5 1.5 0 1 1 0 3 1 1 0 0 0-1 1V17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2.5a1 1 0 0 0-1-1 1.5 1.5 0 1 1 0-3 1 1 0 0 0 1-1V7a2 2 0 0 0-2-2H4Z"/>
              </svg>
            </Badge>
            <svg class="w-32 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M7 6c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2v-4a3 3 0 0 0-3-3H7V6Z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M2 11c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Zm7.5 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" clip-rule="evenodd"/>
              <path d="M10.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
            </svg> -->
          </div>
          <Label class="space-y-2 justify-content">
            <span>Train Name</span>
            <Input id="text" bind:value={inp} type="text" name="Tain Name"  required />
          </Label>
      <Button type="submit" class="w-full1 bg-gray-300 bg-black" on:click={()=>addition()}>Add</Button>
</Modal>