export async function airlineSeatSelect(lastSixValues){

    //console.log(`http://localhost:3001/user/seat_details/${lastSixValues[0]}/${lastSixValues[1]}/${lastSixValues[4]}/person=${lastSixValues[2]}/${lastSixValues[3]}/${lastSixValues[5]}`)
    
    return await fetch(`http://localhost:3001/user/seat_details/${lastSixValues[0]}/${lastSixValues[1]}/${lastSixValues[4]}/person=${lastSixValues[2]}/${lastSixValues[3]}/${lastSixValues[5]}`)

}