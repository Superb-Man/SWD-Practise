export async function busSeatBook( formData,lastFourValues ){

    return await fetch(`http://localhost:3073/user/bus/temp_booking/${lastFourValues[0]}/${lastFourValues[1]}/${lastFourValues[3]}/${lastFourValues[2]}}`, {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json', 
         },
         body: formData, // username, accesstoken, bounceData
      });

}