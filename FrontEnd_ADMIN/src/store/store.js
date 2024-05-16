import { writable } from 'svelte/store';

// export const storecardstatus = writable(false);
// export const storestringcard = writable("This is nothing");

export const storecardtitle = writable("No title");
export const storecardcontent = writable("No content");



// -------  Store username until logout --------

//export const storeusername = writable("");

// -------- Store plane journey detail --------

export const storeSource = writable("Not yet");
export const storeDest = writable("Not yet");

export const storeSeatNumber = writable(0);
export const storePlaneClass = writable("Not yet");
export const storeTrainCoach = writable("Not yet");
export const storeJourneyDate = writable( new Date().toLocaleDateString( 'en-GB' ).split('/').join('-') );

export const storeAirline = writable([]);
export const storeAirlineFilterStatus = writable(0);
export const storeAirlineQuery = writable('');
export const storeSelectedAirline = writable([]);

export const storeTrainFilterStatus = writable(0);
export const storeTrainQuery = writable('');
export const storeSelectedTrain = writable([]);

export const lowerMoneyLimit = writable(0);

export const upperMoneyLimit = writable(1000);

export const storeAirplaneSelectedSeat = writable([])

export const storeFlightTotalCost = writable(0)
export const storeTrainTotalCost = writable(0)






