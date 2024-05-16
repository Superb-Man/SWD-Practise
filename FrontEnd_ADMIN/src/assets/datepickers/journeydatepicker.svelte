<script>
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.min.css';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import '@fortawesome/fontawesome-free/css/all.css';

    export let default_Date

    //let date_today = today.toLocaleDateString(undefined, { timeZone: 'UTC+6'})


    import { storeJourneyDate } from "../../store/store"
    

  
    export let selectedDate;
    let inputElement;
  
    function initializeDatePicker() {
      flatpickr(inputElement, {

        minDate: "today",
        dateFormat: 'd-m-Y',
        onChange: (selectedDates, dateStr) => {
          selectedDate = dateStr;
        },
        defaultDate: default_Date
        
      });
    }
  
    import { afterUpdate } from 'svelte';
  
    afterUpdate(() => {

      initializeDatePicker();
      
    });
  
  </script>
  
  
  
  <div class = "relative min-w-fit border-gray-400 border-4 rounded-lg md:border-none">
    
    <i class="fa-solid fa-xl fa-calendar-check absolute left-3 top-1/2 cursor-pointer"></i>
    <input bind:this={ inputElement } type="text" id="datepicker" class = "pl-10 w-fit md:w-full h-full rounded-sm bg-gray-200 lg:bg-gray-50 border-2 border-gray-800 hover:bg-green-200 border-none" on:change={ () => { storeJourneyDate.set(selectedDate) , default_Date = selectedDate}} />
    
  
  </div>
  