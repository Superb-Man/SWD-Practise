<script >
    import { Label, Input, Button, Checkbox, A } from 'flowbite-svelte';
    

    import Homenavigation from '../../assets/navigation/homenavigation.svelte';
    import Homenavpopover from '../../assets/popovers/homenavpopover.svelte';
    import DatePicker from '../../assets/datepickers/formdatepicker.svelte';


    
    import { push } from 'svelte-spa-router'

    import { signup } from '../../api/signup';
    
  
  
    

    let first_name, last_name, name, username, nid, contact, dateofBirth, mail, password
    let jsonData
    let response_status = 0 , error_message
  

    
    async function signupform(){

      name = first_name + " " + last_name


      jsonData = {
//mail,pass,phone,nid
        
        "username" : username,
        "name" : name,
        "email" : mail,
        "password" : password,
        "phone" : contact,
        "nid" : nid,       
        "Date_of_Birth" : dateofBirth
        
    
      };

      console.log(jsonData)

      const formData = JSON.stringify(jsonData);

      const response = await signup( formData );

      if (!response.ok){

          response_status = response.status
          error_message = await response.json()
      }

      else{

        const data = await response.json();

        console.log(data);


        push(`/home/${username}`)

      }

      
      
    }

    function validateInputs() {
    const form = document.querySelector('form');

    
      if (form.reportValidity()) {
      
        signupform();

      }
    }

    function handleSubmit(event) {

      event.preventDefault();
    
      console.log('Form submitted with username:', username);

    }

  
  </script>
  
  <form on:submit={handleSubmit} >
  
    <div class = "flex flex-col w-screen h-screen fixed overflow-y-hidden overflow-x-hidden">
  
      <div class = "basis-1/3 bg-yellow-300 w-full h-1/5 top-0 left-0 fixed " >
        
       
        <div class = "flex flex-row w-screen h-screen ">
    
          <Homenavigation />
    
    
        </div>
        
      
      </div>
  
  
      <div class = "basis-2/3 w-1/2 h-4/5 left-1/4 mt-2 space-y-12 overflow-y-scroll fixed" id = "top-20"> 
  
        <div class = "flex flex-col justify-center " >
        
        <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label for="first_name" class="mb-2">First Name</Label>
              <Input type="text" id="name" placeholder="Shamsur" bind:value = { first_name } required />
            </div>
            <div>
              <Label for="last_name" class="mb-2">Last Name</Label>
              <Input type="text" id="last_name" placeholder="Rahman" bind:value = { last_name } required />
            </div>
            <div>
              <Label for="NID_number" class="mb-2">NID number</Label>
              <Input type="text" id="NID_number" placeholder="**********" bind:value = { nid } pattern={"[0-9]{10}"} title="NID number must be 10 digit." required />
            </div>
            <div>
              <Label for="contact" class="mb-2">Contact number</Label>
              <Input type="text" id="contact" placeholder="+8801*********" bind:value = { contact } pattern={"[+]{1}8801[3-9]{1}[0-9]{8}"} title="Enter your 10 digit phone number with country code." required />
            </div>
            
            <div>

              <Label for="datepicker" class="mb-2">Date of birth</Label>
              <Label for="datepicker"><DatePicker bind:selectedDate= { dateofBirth } /></Label>
              <!-- <input type="date" id="datepicker" name="datepicker" bind:value={ dateofBirth } class = "w-full cursor-pointer"> -->

          </div>

          

            <div>
              <Label for="user_name" class="mb-2">User Name</Label>
              <Input type="text" id="user_name" placeholder="WurmpleCocoon" bind:value = { username } required />
            </div>
          </div >
          <div class="mb-6">
            <Label for="email" class="mb-2">Email address</Label>
            <Input type="email" id="email" placeholder="shamsur.rahman@company.com" bind:value = { mail } required /> 
          </div>
          <div class="mb-6">
            <Label for="password" class="mb-2">Password</Label>
            <Input type="password" id="password" placeholder="•••••••••" minlength="8" bind:value = { password } pattern = ".*[0-9].*" title="Password must have at least one number" required />
          </div>
          <div class="mb-6">
            <Label for="confirm_password" class="mb-2">Confirm password</Label>
            <Input type="password" id="confirm_password" placeholder="•••••••••" pattern = { password } title = "Passwords did not match. Enter again" required/>
          </div>
          <Checkbox class="mb-6 space-x-1 rtl:space-x-reverse" required>
            I agree with the <A href="/" class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A>.
          </Checkbox>
          <Button type="submit" shadow color="dark" on:click = {() => validateInputs()}>Submit</Button>

          <div>&nbsp;</div>

          <div class = "text-primary-300">  

            {#if response_status === 0}

              <p>&nbsp</p>

            {/if}

            {#if response_status === 409}

              <p> ! User with the highlighted parametres already exists which cannot be duplicated </p>

            {/if}

          </div>

          <div>&nbsp;</div>


  
        </div>
      
      </div>
  
    </div>
  
  
  
  
  </form>
  
  <Homenavpopover />

  <style>

  #top-20 {

    top: 20%

  }
  
  </style>