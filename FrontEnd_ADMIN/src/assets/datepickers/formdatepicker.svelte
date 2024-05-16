<!-- <script>
  import { DatePicker } from '@svelte-plugins/datepicker';
  import { format } from 'date-fns';

  const today = new Date();

  const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

  const getDateFromToday = (days) => {
    return Date.now() - days * MILLISECONDS_IN_DAY;
  };

  let startDate = getDateFromToday(29);
  let endDate = today;
  let dateFormat = 'MMM d, yyyy';
  let isOpen = false;

  let formattedStartDate = '';

  const onClearDates = () => {
    startDate = '';
    endDate = '';
  };

  const toggleDatePicker = () => (isOpen = !isOpen);
  const formatDate = (dateString) => dateString && format(new Date(dateString), dateFormat) || '';

  $: formattedStartDate = formatDate(startDate);
  $: formattedEndDate = formatDate(endDate);

  let selected_date
</script>

<div class="date-filter w-full rounded-1/2 shadow bg-gray-200 cursor-pointer">
  <DatePicker bind:isOpen bind:startDate bind:value = { selected_date } isRange isMultipane class = "">
    <div class="date-field" on:click={toggleDatePicker} class:open={isOpen}>
      <i class="icon-calendar" />
      <div class="date">
        {#if startDate}
          {formattedStartDate} - {formattedEndDate}
        {:else}
          Pick a date
        {/if}
      </div>
      {#if startDate}
        <span on:click={onClearDates}>
          <i class="os-icon-x" />
        </span>
      {/if}
    </div>
  </DatePicker>
</div>

<style>
  .date-field {
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #e8e9ea;
    display: inline-flex;
    gap: 8px;
    min-width: 100px;
    padding: 16px;
  }

  .date-field.open {
    border-bottom: 1px solid #0087ff;
  }

  .date-field .icon-calendar {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEmSURBVHgB7ZcPzcIwEMUfXz4BSCgKwAGgACRMAg6YBBxsOMABOAAHFAXgAK5Z2Y6lHbfQ8SfpL3lZaY/1rb01N+BHUKSMNBfEJjZWISA56Uo6C2KvVpkgFn9oRx9vICFtUT1JKO3tvRtZdjBxXQs+YY+1FenIfuesPUGVVLzfRWKvmrSzbbN19wS+kAb2+sCEuUxrYzkbe4YvCVM2Vr5NPAkVa+van7Wn38U95uTpN5TJ/A8ZKemAakmbmJJGpI0gVmwA0huieFItjG19DgTHtwIZhCfZq3ztCuzQYh+FKBSvusjAGs8PnLYkLgMf34JoIBqIBqKBaIAb0Kw9RlhMCTbzzPWAqYq7LsuPaGDUsYmznaOk5zChUJTNQ4TFVMkrOL4HPsoNn26PxROHCggAAAAASUVORK5CYII=) no-repeat center center;
    background-size: 14px 14px;
    height: 14px;
    width: 14px;
  }
</style> -->









<!-- <div class = "flex-datepicker">

  <label for="datepicker">Select date of birth:</label>
  <input type="date" id="datepicker" name="datepicker">

</div> -->


<script>
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/flatpickr.min.css';
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '@fortawesome/fontawesome-free/css/all.css';

  export let selectedDate;
  let inputElement;

  function initializeDatePicker() {
    flatpickr(inputElement, {
      dateFormat: 'Y-m-d',
      onChange: (selectedDates, dateStr) => {
        selectedDate = dateStr;
      },
    });
  }

  import { afterUpdate } from 'svelte';

  afterUpdate(() => {
    initializeDatePicker();
  });

</script>



<div class = "relative">
  
  <i class="fa-solid fa-xl fa-calendar absolute right-3 top-1/2 cursor-pointer"></i>
  <input bind:this={inputElement} type="text" id="datepicker" class = "w-full rounded-lg bg-gray-50 border-1 border-gray-300 "/>
  

</div>

