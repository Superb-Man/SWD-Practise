<script>

 
    export let images ;
    export let title;
    import { Carousel } from 'flowbite-svelte';
    //import { images } from filename;

    let index = 0;
    let image;

  </script>

  
  
  <!-- <div class="max-w-4xl space-y-4">
    <div class = "mb-2 pb-2 text-left font-serif"> <h1> { title } </h1></div>
    <Carousel { images } imgClass="object-contain h-full w-fit rounded-sm" let:Controls on:change={({ detail }) => (image = detail)} on:click={() => {console.log("a")}} class = "bg-gray-200" >

      <Controls class="items-center text-red-400 dark:text-green-400 pt-4 bg-gray-600 "/>
  
    </Carousel>
  
    <div class="rounded h-10 bg-gray-300 dark:bg-gray-700 dark:text-white p-2 my-2 text-center ">
      {image?.alt}
    </div>

  </div> -->
  
  <div class="max-w-4xl" >

    <div class = "mb-2 pb-2 text-left font-serif"> <h1> { title } </h1></div>
    <Carousel {images} let:Controls class = "shadow-2xl" duration= 3000>
      <Controls class="items-center text-gray-800 dark:border-2 dark:border-gray-400"/>
    </Carousel>

  </div>