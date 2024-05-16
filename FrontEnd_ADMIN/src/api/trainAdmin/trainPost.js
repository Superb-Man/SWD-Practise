export async function addDetails(data) {
    console.log(data)
    return await fetch(`http://localhost:3062/admin/train/addDetails`,{
        // mode : 'no-cors' ,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}

export async function addRoutes(data) {
    console.log(data)
    return await fetch(`http://localhost:3062/admin/routes/add`,{
        // mode : 'no-cors' ,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}

//deleteRoutes
export async function deleteRoutes(data) {
    console.log(data)
    return await fetch(`http://localhost:3062/admin/routes/deleteRoutes`,{
        // mode : 'no-cors' ,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}

//updateRoutes
export async function updateRoutes(data) {
    console.log(data)
    return await fetch(`http://localhost:3062/admin/routes/update`,{
        // mode : 'no-cors' ,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}

export async function addSchedule(data) {
    console.log(data)
    return await fetch(`http://localhost:3062/admin/addschedule`,{
        // mode : 'no-cors' ,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}

export async function getSeatInfoBySchedule(data) {
    console.log(data)
    return await fetch(`http://localhost:3062/admin/train/getInfoBySchedule`,{
        // mode : 'no-cors' ,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}

export async function updateSchedule(data) {
    console.log(data)
    return await fetch(`http://localhost:3062/admin/train/updateSchedule`,{
        // mode : 'no-cors' ,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}


export async function addTrain(data) {
    console.log(data)
    return await fetch(`http://localhost:3062/admin/train/addTrain`,{
        // mode : 'no-cors' ,
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}