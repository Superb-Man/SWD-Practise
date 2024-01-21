<script>

    let BloodGroups = ["A-","A+","AB-","AB+","B-","B+","O-","O+"]

    import { Textarea, Input, Button, Label } from 'flowbite-svelte'
    import Homenavigation from './assets/navigation/homenavigation.svelte';
</script>

<main >


    

    <body class = "signup-page-background" >


        <div class = "flex flex-col w-screen h-screen fixed overflow-y-hidden overflow-x-hidden space-y-36">

            <div class = "basis-1/3 bg-yellow-300 w-full h-1/5 top-0 left-0 fixed " >
              
             
              <div class = "flex flex-row w-screen h-screen ">
          
                <Homenavigation />
          
          
              </div>
              
            
            </div>
    
        </div>
        
        <div class = "form">

            <div class= "signup-page-background-before space-y-6">


                

                <div class = "row space-y-6">

                    <div class = "col-lg-6">

                        <Label> Enter your name : </Label>

                        <Input name="Enter your first name" placeholder="First name" class = "w-96"/> 

                    </div>

                    <div class = "col-lg-6">

                        <Input name="Enter your last name" placeholder="Last name" class = "w-96"/>

                    </div>

                </div>

                <p> </p>

                <p> Enter your address : </p>

                <textarea class="address-field" name="text" placeholder="Enter your address" ></textarea>

                <div class = "flex-component">

                    <div class = "flex-datepicker">

                        <label for="datepicker">Select date of birth:</label>
                        <input type="date" id="datepicker" name="datepicker">

                    </div>

                    <div class = "flex-BloodGroup">

                        <label for="bloodGroupPicker"> Blood Group : </label>


                        <select class= "my-bar" name = "bloodGroupPicker">

                             <option value= "">Select your blood group</option>

                            {#each BloodGroups as bloodGroup }

                                <option value={ bloodGroup }>{ bloodGroup }</option>
    
                            {/each}

                        </select>

                    </div>
                
                

                </div>

                <label for="email">Enter your email:</label>
                <input type="email" id="email" name="email">

                <br>

                <div class = "align-register-button">


                    <button class="signup-button"> Register </button>

                    

                </div>



            </div>

        </div>
            


        


    </body>



</main>


<style>


    

     .signup-page-background{

        justify-content: center;
        /* background-color: yellow; */
        /* background-image: url("https://www.gebpowtravel.com/wp-content/uploads/2019/09/travel-background.jpg"); */
        padding : 20;
        margin : 0;
        /* background-color : rgba(255,255,255,0.9); */
        width : 100%;
        background-size: cover;
        background-repeat : no-repeat;    
        
        

    } 


    .signup-page-background-before{

        
        opacity: 25;
        
    }

    
    .form{

        display: -ms-flex;
        margin: 10px;
        margin-top: 0;
        padding: 10px 10px 10px 10px;
        /* background-color: white; */
        width: 800px;
    }

    .flex-component{

        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-bottom: 30px;
        margin-top: 30px
    }

    .flex-datepicker{

        flex-grow: 2;
    
    }

    .flex-BloodGroup{

        flex-grow: 1;
        justify-content: flex-end;

    }

    .align-register-button{

        
        margin-top : 20px;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        
        
    }

    

    

    


</style>
