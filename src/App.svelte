<script lang="ts">
<!--    This is the login page and script -->
import { Router } from 'svelte-router';

    const googleAuth = () => {
        console.log("Hey there");
    }
</script>

<body>
<h3> Login to your Coffee Book </h3>
<button onclick={googleAuth}> Login/Signup with Google </button>
</body>