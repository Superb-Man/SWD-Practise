export async function airlineSearch(lastFiveValues,query){

    //console.log(`http://localhost:3001/user/air/${lastFiveValues[0]}/${lastFiveValues[1]}/${lastFiveValues[4]}/person=${lastFiveValues[2]}/${lastFiveValues[3]}?${query}`)

    return await fetch(`http://localhost:3001/user/air/${lastFiveValues[0]}/${lastFiveValues[1]}/${lastFiveValues[4]}/person=${lastFiveValues[2]}/${lastFiveValues[3]}?${query}`)

}

// export async function airlineSearch(lastFiveValues,query,formData){

//     return await fetch(`http://localhost:3001/user/air/${lastFiveValues[0]}/${lastFiveValues[1]}/${lastFiveValues[4]}/person=${lastFiveValues[2]}/${lastFiveValues[3]}?${query}`,{
//         method: 'POST',
//         headers: {
//          'Content-Type': 'application/json',
//         },
//         body: formData,
//      }
//     )

// }