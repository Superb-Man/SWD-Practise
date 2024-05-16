export async function getAlltrains(username){
    console.log(username)
    // username = 'Agnibina' ;
    return await fetch(`http://localhost:3062/admin/train/getAllTrains/${username}`)
}

export async function getAllCoaches(train_uid) {
    return await fetch(`http://localhost:3062/admin/train/getAllCoaches/${train_uid}`)
}

export async function getCoachDetails(train_uid,coach_name){
    return await fetch(`http://localhost:3062/admin/train/getCoachDetails/${train_uid}/${coach_name}`)
}

//getRoutes function
export async function getRoutes(train_uid){
    return await fetch(`http://localhost:3062/admin/train/getRoutes/${train_uid}`)
}

export async function getScheduleByUID(train_uid){
    return await fetch(`http://localhost:3062/admin/train/getSchedule/${train_uid}`)
}