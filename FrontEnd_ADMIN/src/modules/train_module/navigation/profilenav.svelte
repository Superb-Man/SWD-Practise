<script>

    import { UserCircleOutline } from 'flowbite-svelte-icons'

    function showCard(title,content) {


    }

</script>

<div class = "mt-12 ">

    <div class = "flex flex-row space-x-10 ">

        <!-- <div ><GradientButton shadow color="teal" > Login </GradientButton></div> -->

        
        <!-- <div></div> -->

        <div class = "right-16 fixed">
            
            <UserCircleOutline id="sign-profile" shadow class = " w-10 h-10 cursor-pointer " on:mouseenter = { () => showCard("User Profile","View or edit your profile?") } > </UserCircleOutline> 
            
            
        </div>

        

    </div>        

</div>
