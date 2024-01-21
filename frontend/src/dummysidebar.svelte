<script>

    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketSolid, FileEditSolid } from 'flowbite-svelte-icons';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import '@fortawesome/fontawesome-free/css/all.css';
    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 bg-gray-200 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';

</script>

  <Sidebar {activeClass} {nonActiveClass} {spanClass}>
    <SidebarWrapper class = "bg-gray-800 min-h-screen">
      <SidebarGroup>
        <SidebarItem label="Dashboard" >
          <svelte:fragment slot="icon">
            <i class="fa-solid fa-hotel"></i>
            
          </svelte:fragment> 
            
          
          <!-- <Icon data={airplane} fill="blue" stroke="black" /> -->
        </SidebarItem>
        <SidebarItem label="Kanban" >
          <svelte:fragment slot="icon">
            <GridSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
          <svelte:fragment slot="subtext">
            <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" > Pro </span>
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Inbox" >
          <svelte:fragment slot="icon">
            <MailBoxSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
          <svelte:fragment slot="subtext">
            <span class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"> 3 </span>
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Sidebar" >
          <svelte:fragment slot="icon">
            <UserSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Sign In">
          <svelte:fragment slot="icon">
            <ArrowRightToBracketSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Sign Up">
          <svelte:fragment slot="icon">
            <FileEditSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>

  