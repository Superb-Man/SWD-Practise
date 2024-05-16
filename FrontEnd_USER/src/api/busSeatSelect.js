export async function busSeatSelect(lastFourValues, formData){

    //console.log(`http://localhost:3001/user/seat_details/${lastSixValues[0]}/${lastSixValues[1]}/${lastSixValues[4]}/person=${lastSixValues[2]}/${lastSixValues[3]}/${lastSixValues[5]}`)
    
    return await fetch(`http://localhost:3073/user/seat_details/${lastFourValues[0]}/${lastFourValues[1]}/${lastFourValues[3]}/${lastFourValues[2]}`,{

        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
         },
        body: formData,
    })

}