<script>
    
  let lastFourValues = []

  const url = new URL(window.location.href)

  const pathsegments = url.hash.split('/').filter(Boolean)

  console.log(pathsegments)

  lastFourValues = pathsegments.slice(-4)

  let status = 0, grid = {}

  console.log(lastFourValues)

  let seatBookWarning = '', openSeatBookAlertModal = false, color = 'red', size = 'xs'

  import { busSeatSelect } from "../../api/busSeatSelect"

  import { Label, Select } from "flowbite-svelte"

  import { ChevronDoubleRightOutline } from 'flowbite-svelte-icons'

  import { Modal } from 'flowbite-svelte'

  import { storeBusBoardTime, storeBusDropTime } from "../../store/store"

  import {proceedToPaymentBus} from "../../api/proceedToPayment"

  import { push } from 'svelte-spa-router'

  function reformatDate(datedmy){

    let date = datedmy.split('-')

    let d = date[0], m = date[1], y = date[2]

    let datemdy = m + '-' + d + '-' + y

    return datemdy

  }

  let rows = 0;
  let columns = 0;
  let last_middle = 0;
  
   
  let selectList = []
  let selectString = []
  let seat_array = []
  let boarding, dropping
  let boarding_list = [], dropping_list = []

  let totalPrice = 0


  async function todo(){

    let x = lastFourValues[3]

    lastFourValues[3] = reformatDate(lastFourValues[3])

    let jsonData = {
    
      "bus_name" : window.sessionStorage.getItem('storeSelectedBusName')

    };

    console.log(jsonData)

    const formData = JSON.stringify(jsonData)

    const response = await busSeatSelect(lastFourValues,formData)
    if (!response.ok) {
      status = response.status;
    }

    else grid = await response.json();

    lastFourValues[3] = x

    rows = grid.dimension[0]
    columns = grid.dimension[1];
    last_middle = grid.last_middle
    //compartments = grid.dimension[0];

    seat_array = grid.seat_details

    for(let i=0; i< grid.boarding.length; i++){

      const newSelection = { name: grid.boarding[i].checkpoint , value: grid.boarding[i]}
      boarding_list = [...boarding_list,newSelection]

    }

    for(let i=0; i< grid.dropping.length; i++){

        const newSelection = { name: grid.dropping[i].checkpoint, value: grid.dropping[i]}
        dropping_list = [...dropping_list,newSelection]

    }

    boarding = boarding_list[0].value

    storeBusBoardTime.set(boarding.counter)

    dropping = dropping_list[dropping_list.length - 1].value

    storeBusDropTime.set(dropping.counter)

    console.log(boarding, dropping)



    //window.sessionStorage.setItem("storeDepartureTime",bus.departure_time)
    //window.sessionStorage.setItem("storeArrivalTime",bus.arrival_time)

    console.log(grid)

    console.log(status)

    //storeAirGrid.set(grid)

  }

  import { onMount } from "svelte"
  import { storeBusTotalCost } from "../../store/store";
  import { busSeatBook } from "../../api/busSeatBook";
  

 
  function isSeatInList(row, col, list) {

    return list.some(item => item[0] === row && item[1] === col ) ;

  }

  function removeSeatFromList(row, col, list) {
    return list.filter(item => !(item[0] === row && item[1] === col  ));
  }

  function removeSeatFromStrList(row, col, str_list) {
    return str_list.filter(item => !(item === String.fromCharCode(65 + row) + (col+1).toString() ));
  }

 
onMount( async() => {

  todo() 

  

  
  
   
  // let selectList = []
  // let seat_array = grid.seat_details

})

function selectSeat(row, col){

  const newSeat = [ row, col,1 ]

  selectList = [...selectList, newSeat]
  let newString 
  
  if(row != -1 && col!= -1) newString = String.fromCharCode(65 + row) + (col+1).toString() 
  else newString = String.fromCharCode(64 + rows) + "M"

  selectString = [...selectString, newString]
  
  console.log(selectList,selectString)

  totalPrice = totalPrice + grid.cost

  console.log(totalPrice)

  storeBusTotalCost.set(totalPrice)

}

function unSelectSeat(row, col){

  //const newSeat = [ row, col ]

  selectList = removeSeatFromList(row, col, selectList)
  if(row != -1 && col != -1) selectString = removeSeatFromStrList(row,col,selectString)
  else selectString = selectString.filter( item => !( item === String.fromCharCode(64 + rows)+"M" ) )

  console.log(selectList,selectString)

  totalPrice = totalPrice - grid.cost

  console.log(totalPrice)

  storeBusTotalCost.set(totalPrice)

}

const doNothing = () => {}

async function proceed() {

  if( selectList.length == 0 ){

    seatBookWarning = "You have not selected seat"
    openSeatBookAlertModal = true

  }

  else if( selectList.length > 10 ){

    seatBookWarning = "You cannot select more than 5 seats at a time"
    openSeatBookAlertModal = true
  }

  else{

    // for(var i=0;i<selectList.length;i++){

    //   const rn = selectList[i][0]
    //   const cn = selectList[i][1]

    //   grid.seat_details[rn*columns+cn] = [rn,cn,1]

    let bookData = {

      "user_name" : window.localStorage.getItem("username"), 
      "accesstoken" : window.localStorage.getItem( window.localStorage.getItem("username") ),
      //"class_name" : grid.class_name,
      "schedule_id" : grid.schedule_id,
      "booked_details" : selectList,



    }

const bookFormData = JSON.stringify(bookData)

const bookResponse = await busSeatBook( bookFormData,lastFourValues )

const dt = await bookResponse.json() 

console.log("out")


    // }

    // let jsonData = {
    
    //   "user_name" : window.sessionStorage.getItem("username"), 
    //   "accesstoken" : window.sessionStorage.getItem( window.sessionStorage.getItem("username") ),
    //   "booked_details" : selectList,
    //   "schedule_id" : grid.schedule_id,
    //   "grandTotalFare" : totalPrice,
    //   "class_name" : grid.class_name,
    //   "transportType" : "bus" 

    // };

    let jsonData = {
    
      "user_name" : window.localStorage.getItem("username"), 
      "accesstoken" : window.localStorage.getItem( window.localStorage.getItem("username") ),
      "seat_booked" : selectList,
      "bus_schedule_id" : grid.schedule_id,
      "grandTotalFare" : totalPrice,
      "category" : grid.category,
      "seat_booked_string" : selectString , 
      "transportType" : "bus" ,
      "source" : grid.source,
      "destination" : grid.destination

    };

    const formData = JSON.stringify(jsonData)

    const response = await proceedToPaymentBus( formData )

    //console.log('response = ' , response)

   const data = await response.json() 

    //console.log('data = ' , data)

    window.location = data.url

  //   console.log(jsonData)

  //  // const formData = JSON.stringify(jsonData)

  //   let x = lastFourValues[4]

  //   lastFourValues[4] = reformatDate(lastFourValues[4])

  //  // const response = await airlineSeatBook( formData,lastSixValues )

  //  // storeAirplaneSelectedSeat.set(selectList)

  //   window.sessionStorage.setItem("storeTrainSelectedSeat",JSON.stringify(selectList) )
  //   window.sessionStorage.setItem("storeTrainTotalCost",totalPrice.toString() )

  //  // const data = await response.json() 

  //   lastFourValues[4] = x

  //   //let source =  lastFourValues[0], seat_class= lastFourValues[2], selectedDate= lastFourValues[3], train_uid = lastFourValues[5]

  //   //push(`/airplane/${window.sessionStorage.username}/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}/${train_uid}/bookseat`)

  //   console.log(grid)

  }

  

}

//import { Boggy } from "../../data/train_details"

function fragmentArray(array, size) {
  return array.reduce((acc, _, i) => (i % size === 0 ? acc.push(array.slice(i, i + size)) : null, acc), []);
}





  
  
</script>


<Label class = "relative w-1/2" for = "src">


      
<i class="fa-solid fa-xl fa-bus absolute left-3 top-1/2 cursor-pointer"></i>

<!-- <Select items= { fragmentArray(Boggy,compartments)[0] } id="text" bind:value = { selectedCompartment } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "    /> -->

<Select items= { boarding_list } id="text" placeholder = "Boarding Point" bind:value = { boarding } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "  on:change = {() => { storeBusBoardTime.set(boarding.counter); window.sessionStorage.setItem("storeDepartureTime",boarding.counter) }} /> 


</Label>

<Label class = "relative w-1/2" for = "dst">


      
<i class="fa-solid fa-xl fa-bus absolute left-3 top-1/2 cursor-pointer"></i>

<!-- <Select items= { fragmentArray(Boggy,compartments)[0] } id="text" bind:value = { selectedCompartment } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer "    /> -->

<Select items= { dropping_list } id="text" placeholder = "Dropping Point" bind:value = { dropping } class = " pl-8 font-bold font-serif bg-gray-100 border-4 border-gray-400 h-18 rounded-lg hover:bg-green-200 cursor-pointer " on:change = {() => { storeBusDropTime.set(dropping.counter);window.sessionStorage.setItem("storeArrivalTime",dropping.counter) }} /> 


</Label>



{#each Array(rows) as _, rowIndex}

<!-- <div class = "max-w-2xl space-y-16 overflow-y-auto"> -->

  <div class="grid_gap_4">
  
    {#each Array(columns) as _, colIndex}

    <!-- <p> {selectList} {selectList.includes( [0,1] ) }</p> -->

      {#if isSeatInList( rowIndex, colIndex, selectList )}

      
      
      <div role="button" tabindex="0" class="bg-blue-300 p-4 text-center cursor-pointer rounded-lg  " on:click={ () => unSelectSeat(rowIndex, colIndex) } on:keydown={ doNothing }>
        {String.fromCharCode(65 + rowIndex)}{colIndex + 1}
      </div>

      {:else if seat_array[columns*rowIndex + colIndex + last_middle][2] === 0 }
      <div role="button" tabindex="0" class="bg-gray-200 p-4 text-center cursor-pointer rounded-lg hover:bg-gray-800 hover:text-gray-200 " on:click={ () => selectSeat(rowIndex, colIndex) } on:keydown={ doNothing }>
        {String.fromCharCode(65 + rowIndex)}{colIndex + 1}
      </div>

      {:else}      
      <div class="bg-gray-400 p-4 text-center text-gray-200 cursor-not-allowed rounded-lg">
          {String.fromCharCode(65 + rowIndex)}{colIndex + 1}
      </div>

      {/if}

      {#if colIndex === columns/2-1}


        {#if rowIndex === rows-1 && last_middle == 1}

          {#if isSeatInList( -1, -1, selectList )}

        
        
            <div role="button" tabindex="0" class="bg-blue-300 p-4 text-center cursor-pointer rounded-lg  " on:click={ () => unSelectSeat(-1, -1) } on:keydown={ doNothing }>
              {String.fromCharCode(65 + rowIndex)}M
            </div>
  
          {:else if seat_array[0][2] === 0 }
            <div role="button" tabindex="0" class="bg-gray-200 p-4 text-center cursor-pointer rounded-lg hover:bg-gray-800 hover:text-gray-200 " on:click={ () => selectSeat(-1, -1) } on:keydown={ doNothing }>
              {String.fromCharCode(65 + rowIndex)}M
            </div>
  
          {:else}      
          <div class="bg-gray-400 p-4 text-center text-gray-200 cursor-not-allowed rounded-lg">
              {String.fromCharCode(65 + rowIndex)}M
          </div>

          {/if}
          
        
        {:else}

          <div class= "p-4"> </div>
          <!-- <div class= "p-4"> </div> -->

        {/if}
      
      {/if}

    {/each}
  
  </div>

<!-- </div> -->
  
{/each}



<div></div>

<!-- <div class = "top-adjust right-0 h-screen w-12 fixed" > -->

<div class=" h-8 w-8 md:h-16 md:w-16 right-10 top-1/2 ring-0 bg-gray-400 opacity-50 fixed rounded-full flex items-center justify-center cursor-pointer" >

  
  <ChevronDoubleRightOutline class = " h-4 w-4 md:h-12 md:w-12  " on:click={ () => proceed() }></ChevronDoubleRightOutline>
 
</div>

<!-- </div> -->

<Modal title= "ALERT" bind:open={ openSeatBookAlertModal } { size } { color } autoclose>{ seatBookWarning }</Modal>


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