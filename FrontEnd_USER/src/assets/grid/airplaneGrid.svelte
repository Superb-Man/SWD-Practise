<script>
    
  let lastSixValues = []

  const url = new URL(window.location.href)

  const pathsegments = url.hash.split('/').filter(Boolean)

  console.log(pathsegments)

  lastSixValues = pathsegments.slice(-6)

  let status = 0, grid = {}

  console.log(lastSixValues)

  let seatBookWarning = '', openSeatBookAlertModal = false, color = 'red', size = 'xs'

  import { airlineSeatSelect } from "../../api/airlineSeatSelect"

  import { ChevronDoubleRightOutline } from 'flowbite-svelte-icons'

  import { Modal } from 'flowbite-svelte'

  import { storeAirplaneSelectedSeat, storeSelectedAirline } from "../../store/store"

  import { proceedToPaymentAir} from "../../api/proceedToPayment"

  import { push } from 'svelte-spa-router'

  function reformatDate(datedmy){

    let date = datedmy.split('-')

    let d = date[0], m = date[1], y = date[2]

    let datemdy = m + '-' + d + '-' + y

    return datemdy

  }

  let rows = 0;
  let columns = 0;
  
   
  let selectList = []
  let selectString = []
  let seat_array = []

  let totalPrice = 0


  async function todo(){

    let x = lastSixValues[4]

    lastSixValues[4] = reformatDate(lastSixValues[4])

    const response = await airlineSeatSelect(lastSixValues)
    if (!response.ok) {
      status = response.status;
    }

    else grid = await response.json();

    lastSixValues[4] = x
    let col = 0 ;
    rows = grid.dimension[0]
    columns = grid.dimension[1];
    col = columns%2 ? columns:(columns-1)/2 ;
    seat_array = grid.seat_details

    console.log(grid)

    console.log(status)

    // storeSelectedAirline.set(grid)

  }

  import { onMount } from "svelte"
  import { storeFlightTotalCost } from "../../store/store";
  import { airlineSeatBook } from "../../api/airlineSeatBook";

  import { airports} from "../../data/airport_name";

  function getPortName(portCode){


    for (const item of airports) {
      if (item.value === portCode) {
        return item.name;
      }
    }


  }
  

 
  function isSeatInList(row, col, list) {

    return list.some(item => item[0] === row && item[1] === col);

  }

  function removeSeatFromList(row, col, list) {
    return list.filter(item => !(item[0] === row && item[1] === col ));
  }
  
  function removeSeatFromStrList(row, col, str_list) {
    return str_list.filter(item => !(item === String.fromCharCode(65 + col) + (row+1).toString() ));
  }
onMount( async() => {

  todo() 

  

  
  
   
  // let selectList = []
  // let seat_array = grid.seat_details

})

function selectSeat(row,col){

  const newSeat = [ row, col,1 ]
  const newString = String.fromCharCode(65 + col) + (row+1).toString() 

  selectList = [...selectList, newSeat]
  selectString = [...selectString, newString]

  console.log(selectList)
  console.log(selectString)

  totalPrice = totalPrice + grid.cost_class

  console.log(totalPrice)

  storeFlightTotalCost.set(totalPrice)

}

function unSelectSeat(row,col){

  //const newSeat = [ row, col ]

  selectList = removeSeatFromList(row,col,selectList)
  selectString = removeSeatFromStrList(row,col,selectString)

  console.log(selectList)
  console.log(selectString)

  totalPrice = totalPrice - grid.cost_class

  console.log(totalPrice)

  storeFlightTotalCost.set(totalPrice)

}

const doNothing = () => {}

async function proceed() {

  if( selectList.length == 0 ){

    seatBookWarning = "You have not selected seat"
    openSeatBookAlertModal = true

  }

  else if( selectList.length > 5 ){

    seatBookWarning = "You cannot select more than 5 seats at a time"
    openSeatBookAlertModal = true
  }

  else{

    // for(var i=0;i<selectList.length;i++){

    //   const rn = selectList[i][0]
    //   const cn = selectList[i][1]

    //   grid.seat_details[rn*columns+cn] = [rn,cn,1]

      


    // }

    let bookData = {

      "user_name" : window.localStorage.getItem("username"), 
      "accesstoken" : window.localStorage.getItem( window.localStorage.getItem("username") ),
      "class_name" : grid.class_name,
      "schedule_id" : grid.schedule_id,
      "booked_details" : selectList,



    }

    const bookFormData = JSON.stringify(bookData)

    const bookResponse = await airlineSeatBook( bookFormData,lastSixValues )

    const dt = await bookResponse.json()

    let jsonData = {
    
      "user_name" : window.localStorage.getItem("username"), 
      "accesstoken" : window.localStorage.getItem( window.localStorage.getItem("username") ),
      "seat_booked" : selectList,
      "air_schedule_id" : grid.schedule_id,
      "grandTotalFare" : totalPrice,
      "class_name" : grid.class_name,
      "seat_booked_string" : selectString , 
      "transportType" : "air" ,
      "source" : getPortName(grid.from_Port),
      "destination" : getPortName(grid.to_Port)

    };

    const formData = JSON.stringify(jsonData)

    const response = await proceedToPaymentAir( formData )

    console.log('response = ' , response)

    const data = await response.json() 

    console.log('data = ' , data)

    window.location = data.url

    // let x = lastSixValues[4]

    // lastSixValues[4] = reformatDate(lastSixValues[4])

    // const response = await airlineSeatBook( formData,lastSixValues )

    // storeAirplaneSelectedSeat.set(selectList)

    // window.sessionStorage.setItem("storeAirplaneSelectedSeat",JSON.stringify(selectList) )
    // window.sessionStorage.setItem("storeFlightTotalCost",totalPrice.toString() )

    // const data = await response.json() 

    // lastSixValues[4] = x

    // let source =  lastSixValues[0], dest = lastSixValues[1], seat_number= parseInt(lastSixValues[2],10), seat_class= lastSixValues[3], selectedDate= lastSixValues[4], flight_id = lastSixValues[5]

    // push(`/airplane/${window.sessionStorage.username}/${source}/${dest}/${seat_number}/${seat_class}/${selectedDate}/${flight_id}/bookseat`)

    console.log(grid)

  }

  

}

  
  
</script>





{#each Array(rows) as _, rowIndex}

<!-- <div class = "max-w-2xl space-y-16 overflow-y-auto"> -->

  <div class="grid_gap_4">
  
    {#each Array(columns) as _, colIndex}

    <!-- <p> {selectList} {selectList.includes( [0,1] ) }</p> -->

      {#if isSeatInList( rowIndex,colIndex,selectList )}

      
      
      <div role="button" tabindex="0" class="bg-blue-300 p-4 text-center cursor-pointer rounded-lg  " on:click={ () => unSelectSeat(rowIndex,colIndex) } on:keydown={ doNothing }>
        {String.fromCharCode(65 + colIndex)}{rowIndex + 1}
      </div>

      {:else if seat_array[columns*rowIndex + colIndex][2] === 0 }
      <div role="button" tabindex="0" class="bg-gray-200 p-4 text-center cursor-pointer rounded-lg hover:bg-gray-800 hover:text-gray-200 " on:click={ () => selectSeat(rowIndex,colIndex) } on:keydown={ doNothing }>
        {String.fromCharCode(65 + colIndex)}{rowIndex + 1}
      </div>

      {:else}      
      <div class="bg-gray-400 p-4 text-center text-gray-200 cursor-not-allowed rounded-lg">
          {String.fromCharCode(65 + colIndex)}{rowIndex + 1}
      </div>

      {/if}

      {#if colIndex*2+2 === columns || colIndex*2+1 === columns} 

          <div class= "p-4"> </div>
          <div class= "p-4"> </div>
      
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