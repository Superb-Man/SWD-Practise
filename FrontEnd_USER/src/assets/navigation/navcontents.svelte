<script>

    import { Avatar, Button } from 'flowbite-svelte';

    import { UserCircleOutline, HomeOutline } from 'flowbite-svelte-icons'
    //import { storecardstatus, storestringcard } from '../../store/store'

    import { storecardtitle, storecardcontent } from '../../store/store'

    import { push } from 'svelte-spa-router'


    let stringCardTitle;
    let stringCardContent;
    const username = window.localStorage.username

    storecardtitle.subscribe( title => { stringCardTitle = title} )
    storecardcontent.subscribe( content => { stringCardContent = content} )

    function showCard(title,content) {

     storecardtitle.set(title)
     storecardcontent.set(content)
    
   }

   function signup(){

    push('/signup')

   }

   function login(){

    push('/login')

   }

   function logout(){

    window.localStorage.removeItem(window.localStorage.getItem("username") )
    window.localStorage.removeItem("username")
    push('/')

   }

   import { createClient } from '@supabase/supabase-js';


    const supabaseUrl = 'https://khazmldyfxzbiyyvockm.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoYXptbGR5Znh6Yml5eXZvY2ttIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzMyMTY0NiwiZXhwIjoyMDIyODk3NjQ2fQ.kHzF_B0tp8Q0chYbiQ7WeInUnnTrNvNHtNFBGR7-YuQ';
    const supabase = createClient(supabaseUrl, supabaseKey);

   //
//    async function imageUpload(username){

//     const { data: res, error: err } = await supabase.storage
//                 .from('imageInsertion2')
//                 .upload(name, newClass.WorkExperiencesImage, {
//                     cacheControl: '3600',
//                     upsert: false
//                 });


//    }

async function checkUrlExistence(imagePath) {
  
    // List files in the storage bucket
    const { data: files, error } = await supabase.storage
      .from('imageInsertion2') // Replace with your actual bucket name
      .list();

    if (error) {
      throw new Error(`Error listing files: ${error.message}`);
    }

    // Check if the specified image path exists in the list
    const imageExists = files.some(file => file.name === imagePath);

    return imageExists;
  
}


    async function getImageUrl(){

        const imageUrl = supabase.storage
        .from('imageInsertion2')
        .getPublicUrl('/images/'+username).data.publicUrl;

        console.log(imageUrl)

        //if( checkUrlExistence(imageUrl) == false ) return "";
        imageInFrame = imageUrl
    }

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Upload image to Supabase Storage
      const { data, error } = await supabase.storage
        .from('imageInsertion2') // Replace with your storage bucket name
        .upsert('images/' + username, file);

      if (error) {
        console.error('Error uploading image:', error.message);
      } else {
        console.log('Image uploaded successfully:', data);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  }

   

   

           


    let imageInput;
    let my_image_file = ''
    let files;
   // let imageInFrame = 
    let imageInFrame;
    let imageSelectFlag = 0;
    // let imageOutputFlag = 0;
    // let imageOutput;


   function getBase64(image) {
        imageSelectFlag = 0;
        const reader = new FileReader();

        my_image_file = image;
        uploadImage(image);


        reader.readAsDataURL(image);
        reader.onload = e => {

            imageSelectFlag = 1;
            imageInFrame = e.target.result;


            //localStorage.setItem('imageInFrame',imageInFrame)

            //localStorage.setItem('image',reader.result)

            
            //myVarList.set(imageInFrame);

            // myVarList.subscribe(imageValue => {
            //     imageInFrame = imageValue;
            // }) 
        };
    };
    

    // let cardstatus;
    // let stringCard;

    // storecardstatus.subscribe( val => { cardstatus = val} )
    // storestringcard.subscribe( val => { stringCard = val} )
    

    // function showCard(str) {

    //     storecardstatus.set(true)
    //     storestringcard.set(str)
        
    // }

    // const unShowCard = () => {

    //     storecardstatus.set(false)

    // }

</script>

<div class = "mt-12 ">

    <div class = "flex flex-row space-x-10 ">

        <!-- <div ><GradientButton shadow color="teal" > Login </GradientButton></div> -->

        { #if username === undefined }

        <div class = " text-lg right-36 md:right-64 lg:right-72 fixed ">
            
            <Button id="sign-up" shadow color="dark" on:mouseenter = { () =>  showCard("SignUp","Want to Register?") } on:click = { () => signup() } > Sign Up </Button> 
 
            
            
            
        </div>

        { :else }

        <div class = "text-sm md:text-lg right-48 md:right-72 lg:right-96 font-bold fixed">
                        
            <p> {username} </p>             
            
        </div>

        {/if}

        <div class = "right-12 md:right-36 lg:right-40 fixed">
            
            { #if username === undefined } <Button id="sign-in" shadow color="dark" on:mouseenter = { () => showCard("Login","Want to Sign into your account?") } on:click = { () => login() } > Login </Button> 

            { :else } <Button id="logout" shadow color="dark" size="lg" on:mouseenter = { () => showCard("Logout","Want to Log out from your account?") } on:click = { () => logout() } > Logout </Button> 
            
            {/if}

        </div>

        
        <!-- <div></div> -->

        <div class = "right-4 md:right-6 lg:right-8 fixed">
            
            { #if username === undefined } <UserCircleOutline id="sign-profile" shadow class = " w-5 h-5 md:w-10 md:h-10 cursor-pointer " on:mouseenter = { () => showCard("User Profile","View or edit your profile?") } > </UserCircleOutline> 
            
            { :else } 

            <!-- <UserCircleOutline id="sign-profile" shadow class = " w-5 h-5 md:w-10 md:h-10 cursor-pointer " on:mouseenter = { () => showCard("User Profile","View or edit your profile?") } > </UserCircleOutline>  -->

            <input class="hidden" id="file-to-upload" name= "image" type="file" accept=".png,.jpg,.gif" bind:files bind:this={imageInput}  on:change={() => getBase64(files[0])}/>
            
            <!-- {#if username == undefined  }  -->
            
            <HomeOutline id="sign-profile" shadow class = " w-5 h-5 md:w-10 md:h-10 cursor-pointer " on:mouseenter = { () => showCard("","Back To Home?") } on:click= { () => {window.location.href = `/home/${username}`} }> </HomeOutline> 
            
            <!-- {:else} <img id="image_layer" src={ imageInFrame } alt="uploaded_image" class = " w-5 h-5 md:w-10 md:h-10 cursor-pointer rounded-full" on:click= { () => imageInput.click() } >  -->

            
            <!-- {/if} -->
            
            { /if }
            
        </div>

        

    </div>        

</div>

<!-- <div>

    {#if cardstatus === true}

        <Iconcard stringCard = { stringCard } /> 
        
    {/if}

</div> -->