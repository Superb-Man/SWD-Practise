<script>
    import { Label, Input, InputAddon, ButtonGroup,  Helper, Button, Checkbox, A } from 'flowbite-svelte';
    import { EnvelopeSolid, LockSolid, PauseSolid } from 'flowbite-svelte-icons';
    import Homenavigation from './navigation/homenavigation.svelte';
    import Homenavpopover from './popovers/homenavpopover.svelte';

    let name,username,nid,contact

    
    function further(){

      console.log(name,username,nid,contact)
    }

  
  </script>
  
  <form>
  
  <div class = "flex flex-col w-screen h-screen fixed overflow-y-hidden overflow-x-hidden ">
  
      <div class = "basis-1/3 bg-yellow-300 w-full h-1/5 top-0 left-0 fixed " >
        
       
        <div class = "flex flex-row w-screen h-screen ">
    
          <Homenavigation />
    
    
        </div>
        
      
      </div>
  
  
      <div class = "basis-2/3 w-1/2 h-4/5 top-40 left-1/4 mt-2 space-y-12 fixed overflow-y-scroll "> 
  
        <div class = "flex flex-col justify-center " >
        
        <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <Label for="name" class="mb-2">Name</Label>
              <Input type="text" id="first_name" placeholder="John" bind:value = {name} required />
            </div>
            <div>
              <Label for="user_name" class="mb-2">User name</Label>
              <Input type="text" id="last_name" placeholder="Doe" bind:value = {username} required />
            </div>
            <div>
              <Label for="NID_number" class="mb-2">NID number</Label>
              <Input type="text" id="nid" placeholder="...." bind:value = {nid} pattern={"[0-9]{13}"} required />
            </div>
            <div>
              <Label for="contact" class="mb-2">Contact number</Label>
              <Input type="text" id="phone" placeholder="+8801*********" bind:value = {contact} pattern={"[+]{1}8801[3-9]{1}[0-9]{8}"} required />
            </div>
            <div>
              <Label for="website" class="mb-2">Website URL</Label>
              <Input type="url" id="website" placeholder="flowbite.com" required />
            </div>
            <div>
              <Label for="visitors" class="mb-2">Unique visitors (per month)</Label>
              <Input type="number" id="visitors" placeholder="" required />
            </div>
          </div >
          <div class="mb-6">
            <Label for="email" class="mb-2">Email address</Label>
            <Input type="email" id="email" placeholder="john.doe@company.com" required />
          </div>
          <div class="mb-6">
            <Label for="password" class="mb-2">Password</Label>
            <Input type="password" id="password" placeholder="•••••••••" minlength="8" required />
          </div>
          <div class="mb-6">
            <Label for="confirm_password" class="mb-2">Confirm password</Label>
            <Input type="password" id="confirm_password" placeholder="•••••••••" required />
          </div>
          <Checkbox class="mb-6 space-x-1 rtl:space-x-reverse" required>
            I agree with the <A href="/" class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A>.
          </Checkbox>
          <Button type="submit" shadow color="dark" on:click = {() => further()}>Submit</Button>

          <div> &nbsp </div>


  
        </div>
      
      </div>
  
    </div>
  
  
  
  
  </form>
  
  <Homenavpopover />