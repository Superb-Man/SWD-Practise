export async function signup( formData ){

    const response = await fetch('http://localhost:3000/user/signup', {

         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
         body: formData,

    })

    return response

}
