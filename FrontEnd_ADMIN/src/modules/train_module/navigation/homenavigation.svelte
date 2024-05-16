<script>

    import Navtitle from "./navtitle.svelte";
    import Navcontents from "./navcontents.svelte";

    let activeUrl =  window.location.pathname + window.location.hash
    let activeClass = 'text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent';
    let nonActiveClass = 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';

    import { NavLi, NavUl } from 'flowbite-svelte';

    export let route;

    let username = window.sessionStorage.getItem("username")

    let selected = window.sessionStorage.getItem("selected")

    console.log(activeUrl,username)

    

    let abspath = "/#/home/" + username + "/" + selected

    //console.log(abspath)

</script>

<div class = "basis-1/5">

    <Navtitle />

</div>

  <div class = "basis-1/5 h-one-tenth w-full ml-96 mt-24" >

    {#if route === "route" || route === "sched" || route === "coach" || route === "ticketstats" || route === "config" || route === "stats"}

      <NavUl {activeUrl} {activeClass} {nonActiveClass}>
        <NavLi href = "{abspath}/route" class = "text-lg cursor-pointer">Route</NavLi>
        <NavLi href = "{abspath}/coach" class = "text-lg cursor-pointer">Coach</NavLi>
        <NavLi href = "{abspath}/sched" class = "text-lg cursor-pointer">Schedule</NavLi>
        <NavLi href = "{abspath}/config" class = "text-lg cursor-pointer">Config</NavLi>
        <NavLi href = "{abspath}/stats" class = "text-lg cursor-pointer">Stats</NavLi>
        <!-- <NavLi href = "{abspath}/stats" class = "text-lg cursor-pointer">Stats</NavLi> -->
      </NavUl>

    {/if}
  </div>

  <div class = "basis-2/5 h-one-tenth w-full " >

    <Navcontents />

  </div>

  <style>

    .h-one-tenth {

      height: 10%

    }
  </style>