<script>

    import { NavLi, Select,NavUl} from 'flowbite-svelte'
    import { Card } from 'flowbite-svelte'

    import { seatType } from '../../data/train_details';
    import { onMount } from 'svelte';
    import  {getAllCoaches} from '../../api/trainAdmin/trainGet'
    import  {getCoachDetails} from '../../api/trainAdmin/trainGet'

    let train = window.sessionStorage.getItem("selected")
    let coach = "AC_S", rows= 0 , columns = 5 ,compartments = 0 ;

    //get All coaches
    ///############################//
    let coaches = []
    onMount( async() =>{
      const response = await getAllCoaches(train);
      if(!response.ok){
        console.log("error")
        return
      }
      if(response.status != 200){
            console.log("no routes found") ;
            return ;
      }
      let data = await response.json();
      console.log(data)
      rows = data.dimensions[0][2] ;
      columns = data.dimensions[0][1] ;
      compartments = data.dimensions[0][0] ;
      coach = data.coaches[0] ;
      //make a json object of name and value of coaches mapping to data.coaches
      // compartments = data[0].compartments;
      coaches = data.coaches.map(item => {
          return { name: item, value: item };
      });
    }) ;

    async function getCoachByName(coach){
      const response = await getCoachDetails(train, coach);
      if(!response.ok){
        console.log("error")
        return
      }
      if(response.status != 200){
            console.log("no routes found") ;
            return ;
      }
      let data = await response.json();
      rows = data.dimensions[2] ;
      columns = data.dimensions[1] ;
      compartments = data.dimensions[0] ;
      console.log('here') 

    }
    //#############################//
    // load() ;
    console.log(coach)
    console.log(coaches) 




    let col = columns ;
    if(col%2 === 1){
      col = columns - 1;
    }
    console.log(col) 
    let customized = 'pl-60'
    let added_coach = false ;
    if(compartments !=1){
      customized = 'left-1/2'
    }
    let namesofCompartment = ['KA','KHA','GA','GHA','NGA','CHA','CHHA','JA','JHA','NYA','TA','THA','DA','DHA','NA','TA','THA','DA','DHA','NA','PA','PHA','BA','BHA','MA','YA','RA','LA','WA','SHA','SSA']
  
</script>

<!-- <Card size = "lg"> -->
  <div class="container {customized}" id= "canvas">
    <div class = "w-1/4 items-center grid grid-cols-2 space-x-8">

      <Select items= { coaches } id="text" bind:value = { coach } class = " mr-8 pl-8 font-bold font-serif bg-white border-4 border-gray-400 h-18 rounded-lg hover:bg-white cursor-pointer " on:change={()=>getCoachByName(coach)}    />
      <!-- <Select items= { seatType } id="text" bind:value = { coach } class = " mx-8 pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-gray-400 cursor-pointer "    /> -->
      <h1 class = "font-bold text-center " > { train } </h1>

    </div>
    <div class="py-8">
    </div>
    <div class="container grid grid-cols-2 space-y-8 flex-justify-content">
      {#each Array(compartments) as _, compartment_index}
        <Card class = "flex-justify-content space-y-8 shadow-lg" size = "md" style="background-color:#ffffee">
          <h1>{namesofCompartment[compartment_index]}</h1>
          {#each Array(rows) as _, rowIndex}
        
          <!-- <div class = "max-w-2xl space-y-16 overflow-y-auto"> -->
            <div class="grid_gap_4">
            
              {#each Array(columns) as _, colIndex}
        
              <!-- <p> {selectList} {selectList.includes( [0,1] ) }</p> -->
        
                <!-- {#if isSeatInList( rowIndex, colIndex, selectedCompartment, selectList )}
        
                
                
                <div role="button" tabindex="0" class="bg-blue-300 p-4 text-center cursor-pointer rounded-lg  " on:click={ () => unSelectSeat(rowIndex, colIndex, selectedCompartment) } on:keydown={ doNothing }>
                  {String.fromCharCode(65 + colIndex)}{rowIndex + 1}
                </div> 
        
                {:else if seat_array[columns*(compartments* selectedCompartment + rowIndex) + colIndex][2] === 0 }
                <div role="button" tabindex="0" class="bg-gray-200 p-4 text-center cursor-pointer rounded-lg hover:bg-gray-800 hover:text-gray-200 " on:click={ () => selectSeat(rowIndex, colIndex, selectedCompartment) } on:keydown={ doNothing }>
                  {String.fromCharCode(65 + colIndex)}{rowIndex + 1}
                </div>
        
                {:else}       -->
                <div class="bg-blue-900 p-4 text-center text-white cursor-not-allowed rounded-lg">
                    {String.fromCharCode(65 + colIndex)}{rowIndex + 1}
                </div>
        
                <!-- {/if} -->
                <!-- max-column 5 or 4 -->
                {#if colIndex === col/2-1}
        
                    <div class= "p-2"> </div>
                    <div class= "p-2"> </div>
                
                {/if}
        
              {/each}
            
            </div>
        
          <!-- </div> -->
            
          {/each}
        </Card>
      {/each}
    </div>
  </div>
<!-- </Card> -->


<!-- write a div class to show compartment if , coach is selected then the compartment will be activated -->

<!-- Show teo dropdown select icon by side -->




  <style>

    .grid_gap_4 {
    
        display: grid;
        grid-template-columns: repeat(auto-fill ,minmax(50px, 1fr));
        gap: 1rem;
        max-width: 42rem;
    
    }
    
    /* @media only screen and (max-width: 2048px){
    
      .top-adjust {
    
        top: 20%
    
      }
    
    } */
    
    
    
    </style>