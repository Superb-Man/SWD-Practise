export async function trainSeatBook( formData,lastSixValues ){

    return await fetch(`http://localhost:3062/user/train/temp_booking/${lastSixValues[0]}/${lastSixValues[1]}/${lastSixValues[4]}/person=${lastSixValues[2]}/${lastSixValues[3]}/${lastSixValues[5]}`, {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json', 
         },
         body: formData, // username, accesstoken, bounceData
      });

}