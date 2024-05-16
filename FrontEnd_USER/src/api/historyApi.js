export async function airHistoryApi(formData){

    return await fetch('http://localhost:3001/user/air/history',{

        method: 'POST',
        headers: {
        'Content-Type': 'application/json', 
        },
        body: formData,
    })
}

export async function trainHistoryApi(formData){

    return await fetch('http://localhost:3062/user/train/history',{

        method: 'POST',
        headers: {
        'Content-Type': 'application/json', 
        },
        body: formData,
    })
}