export async function loginapi( formData ){

    return await fetch('http://localhost:3000/admin/login', {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
         body: formData,
      });

}