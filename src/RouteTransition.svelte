
<script>
    import { fly,fade, blur, slide, scale } from "svelte/transition";
    import { quintOut } from 'svelte/easing';

    export let x = 200;
    export let duration = 500;
    /** @type {"forward"|"backward"} */
    export let direction = "forward";

    $: directionFactor = direction === "forward" ? 1 : -1;
</script>

<div
        class="route-wrapper"
        transition:scale={{ delay: 250, duration: 300, easing: quintOut }}
>
    <slot />
</div>

<style>
    .route-wrapper {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>