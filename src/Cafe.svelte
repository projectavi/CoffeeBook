<script>
    export let itemLabel;
    export let highlighted;

    let cafeName = "Plearn";
</script>

<h1> {cafeName} </h1>
<!--Autocomplete for the drink, if a second rating is added for the same drink then load in the information for modification-->



<style>
    li.autocomplete-items {
        list-style: none;
        border-bottom: 1px solid #d4d4d4;
        z-index: 99;
        /*position the autocomplete items to be the same width as the container:*/
        top: 100%;
        left: 0;
        right: 0;
        padding: 10px;
        cursor: pointer;
        background-color: #fff;
    }

    li.autocomplete-items:hover {
        /*when hovering an item:*/
        background-color: #81921f;
        color: white;
    }

    li.autocomplete-items:active {
        /*when navigating through the items using the arrow keys:*/
        background-color: DodgerBlue !important;
        color: #ffffff;
    }

    .autocomplete-active {
        /*when navigating through the items using the arrow keys:*/
        background-color: DodgerBlue !important;
        color: #ffffff;
    }
</style>

<li class="autocomplete-items" class:autocomplete-active={highlighted} on:click>{@html itemLabel}</li>