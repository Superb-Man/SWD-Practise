export async function signup( formData ){

    const response = await fetch('http://localhost:3000/admin/signup', {

         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
         body: formData,

    })

    return response

}
