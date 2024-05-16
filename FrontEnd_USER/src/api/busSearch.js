export async function busSearch(lastFourValues,query,formData){

    //console.log(`http://localhost:3001/user/air/${lastFiveValues[0]}/${lastFiveValues[1]}/${lastFiveValues[4]}/person=${lastFiveValues[2]}/${lastFiveValues[3]}?${query}`)

    return await fetch(`http://localhost:3073/user/bus/${lastFourValues[0]}/${lastFourValues[1]}/${lastFourValues[3]}/${lastFourValues[2]}?${query}`,{

        method: 'POST',
        headers: {
        'Content-Type': 'application/json', 
        },
        body: formData,
        
    })

}