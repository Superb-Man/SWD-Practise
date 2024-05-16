
export async function proceedToPaymentAir( formData ){
    console.log(formData)
    return await fetch(`http://localhost:8000/payment/initAir`,  {
        //  mode: 'cors',
         method: 'POST',
         headers: {
          'Content-Type': 'application/json', 
         },
         body: formData, 
      });

}


export async function proceedToPaymentTrain( formData ){
    console.log(formData)
    return await fetch(`http://localhost:8000/payment/initTrain`,  {
        //  mode: 'cors',
         method: 'POST',
         headers: {
          'Content-Type': 'application/json', 
         },
         body: formData, 
      });

}

export async function proceedToPaymentBus( formData ){
    console.log(formData)
    return await fetch(`http://localhost:8000/payment/initBus`,  {
        //  mode: 'cors',
         method: 'POST',
         headers: {
          'Content-Type': 'application/json', 
         },
         body: formData, 
      });

}
