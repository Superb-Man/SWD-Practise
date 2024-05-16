

<script>

  let username,pass
  let jsonData 
  let response_status = 0 , error_message
  //let getstoreusername

  import { Label, Input, InputAddon, ButtonGroup, Button } from 'flowbite-svelte';
  import { EnvelopeSolid, LockSolid } from 'flowbite-svelte-icons';
  import Homenavigation from '../../assets/navigation/homenavigation.svelte';
  import Homenavpopover from '../../assets/popovers/homenavpopover.svelte';

  //import { storeusername } from '../store/store'////////////////

  import { push } from 'svelte-spa-router'
  import { loginapi } from '../../api/login';

  //storeusername.subscribe( username => { getstoreusername = username })////////////////

  async function login(){


    //push('/signupform')
    console.log(username)
    console.log(pass)

    

    jsonData = {
      
      "username" : username, 
      "password" : pass,
    
    };

    // const formData = new FormData();
    // formData.append('signupdata', JSON.stringify(jsonData));

    const formData = JSON.stringify(jsonData)

    console.log( formData )
    // const request = {
    //   "username" : formData.
    // }

    console.log( formData )

    const response = await loginapi( formData )

    if (!response.ok){

      response_status = response.status
      error_message = await response.json();

    }

    else{

      const data = await response.json();

      //storeusername.set(username)////////////

      window.localStorage.setItem( username , data.accesstoken )

      window.localStorage.setItem( "username", username)
      
      console.log(data);

      push( `/home/${ username }`)


    }

     


  }

  // const response = await fetch('./upload', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     console.log(data);

</script>



<div class = "flex flex-col w-screen h-screen fixed overflow-y-scroll overflow-x-hidden space-y-36">

    <div class = "basis-1/3 bg-yellow-300 w-full h-1/5 top-0 left-0 fixed " >
      
     
      <div class = "flex flex-row w-screen h-screen ">
  
        <Homenavigation />
  
  
      </div>
      
    
    </div>

    

    <div class = "basis-2/3 w-full h-4/5 top-16 md:top-40 mt-2 left-0 space-y-12 fixed overflow-y-scroll "> 

      
      
      <div class="mb-6">
        <Label for="username" class="block mb-2 text-lg font-serif">Enter Your Username &emsp; &emsp; &ensp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &ensp;</Label>

  

        <ButtonGroup class="w-64 md:w-96">
          <InputAddon>
            <EnvelopeSolid class="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </InputAddon>


          <Input class = "peer w-full h-full text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 transition-all " id="username" type="text" placeholder="WurmpleCocoon" bind:value={ username } required/>
    
        </ButtonGroup>
      
      </div>

      

      <div class="mb-6">

        <Label for="website-user" class="block mb-2 text-lg font-serif">Enter the Password &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; </Label>

          <ButtonGroup class="w-64 md:w-96">

            <InputAddon>
              <LockSolid class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </InputAddon>

            <Input id="password" type="password" placeholder="•••••••••"  bind:value= {pass} required/>

          </ButtonGroup>  
      
      </div>

      <div> <a href="https://google.com"><p> Forgot password? Try another way </p> </a></div>

      <div >
            
        <Button id="submit-email" type = "submit" shadow color="dark" on:click = { () => login()} > Submit </Button> 
        
      </div>

      <div class = "text-primary-300">  

        {#if response_status === 401}

          <p> ! Either password or email is incorrect </p>
          <!-- <p> ! {error_message.message}</p> -->

        {/if}

      </div>

      <div>&nbsp;</div>

    
    
    </div>

  


</div>



<Homenavpopover />

<!-- <div class="mb-6">
  <Label for="website-admin" class="block mb-2 text-left text-lg font-serif">Enter Your Email</Label>

  <Input />

  <ButtonGroup class="w-96">
    <InputAddon>
      <EnvelopeSolid class="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </InputAddon>


    <Input class = "peer w-full h-full text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 transition-all " id="email" type="email" placeholder="abc@gmail.com" />
    
  </ButtonGroup>

  <Label class="block mb-2">Your email</Label>
<Input label="Email" id="email" name="email" required placeholder="name@flowbite.com" />

</div> -->

<!-- <div class="mb-6">
    <Label for="website-admin" class="block mb-2">Enter a Password</Label>
    <ButtonGroup class="w-full">
      <InputAddon>
        <LockSolid class="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </InputAddon>
      <Input id="password" type="password" placeholder="am@R_aChe_J0L" />
    </ButtonGroup>
</div> -->


  
  <!-- <form>
    <div class="grid gap-6 mb-6 md:grid-cols-2">
      <div>
        <Label for="first_name" class="mb-2">First name</Label>
        <Input type="text" id="first_name" placeholder="John" required />
      </div>
      <div>
        <Label for="last_name" class="mb-2">Last name</Label>
        <Input type="text" id="last_name" placeholder="Doe" required />
      </div>
      <div>
        <Label for="company" class="mb-2">Company</Label>
        <Input type="text" id="company" placeholder="Flowbite" required />
      </div>
      <div>
        <Label for="phone" class="mb-2">Phone number</Label>
        <Input type="tel" id="phone" placeholder="123-45-678" pattern={"[0-9]{3}-[0-9]{2}-[0-9]{3}"} required />
      </div>
      <div>
        <Label for="website" class="mb-2">Website URL</Label>
        <Input type="url" id="website" placeholder="flowbite.com" required />
      </div>
      <div>
        <Label for="visitors" class="mb-2">Unique visitors (per month)</Label>
        <Input type="number" id="visitors" placeholder="" required />
      </div>
    </div>
    <div class="mb-6">
      <Label for="email" class="mb-2">Email address</Label>
      <Input type="email" id="email" placeholder="john.doe@company.com" required />
    </div>
    <div class="mb-6">
      <Label for="password" class="mb-2">Password</Label>
      <Input type="password" id="password" placeholder="•••••••••" required />
    </div>
    <div class="mb-6">
      <Label for="confirm_password" class="mb-2">Confirm password</Label>
      <Input type="password" id="confirm_password" placeholder="•••••••••" required />
    </div>
    <Checkbox class="mb-6 space-x-1 rtl:space-x-reverse" required>
      I agree with the <A href="/" class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A>.
    </Checkbox>
    <Button type="submit">Submit</Button>
  </form>
 -->
