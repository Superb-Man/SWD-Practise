export async function getTrainRoute( formData ){

    return await fetch("http://localhost:3062/user/train/route_details", {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json', 
         },
         body: formData, // username, accesstoken, bounceData
      });

}