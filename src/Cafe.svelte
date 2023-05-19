<script lang="ts">
    import ListItem from "./ListItem.svelte";

    export let itemLabel;
    export let highlighted;
    import { useLocation } from "svelte-navigator";

    const location = useLocation();

    let cafeObj = $location.state.cafe;

    let cafeName = cafeObj.name;

    let weightObj = cafeObj.weights;
    let drinkObjs = cafeObj.drinks;

    let drinks = [];
    drinkObjs.forEach(drink => {
        drinks.push(drink.name);
    });

    let drink_name: string;

    let filteredDrinks = [];

    const filterDrinks = () => {
        let tempArr = [];
        if (drinkInputValue) {
            drinks.forEach(drink => {
                if (drink.toLowerCase().startsWith(drinkInputValue.toLowerCase())) {
                    tempArr = [...tempArr, makeMatchBold(drink)];
                }
            })
        }
        filteredDrinks = tempArr;
    }

    let drinkSearchInput;
    let drinkInputValue = "";

    $: if (!drinkInputValue) {
        filteredDrinks = [];
        hiLiteIndex = null;
    }

    const clearDrinkInput = () => {
        drinkInputValue = "";
        drinkSearchInput.focus();
    }

    const setDrinkInputVal = (drinkName) => {
        drinkInputValue = removeBold(drinkName);
        filteredDrinks = [];
        hiLiteIndex = null;
        document.querySelector('#drink-input');
    }

    const submitValue = () => {
        if (drinkInputValue) {
            console.log("Submitted: " + drinkInputValue);
            setTimeout(() => {
                clearDrinkInput();
            }, 1000);
            // Check if the cafe exists and if it does not then make an entry for it
            let drinkObj = drinkObjs.find(obj => obj["name"] === drinkInputValue);
            if (drinkObj === undefined) {
                drinkObj = {};
            }
        }
        else {
            alert("Please enter the required information");
        }
    }

    const makeMatchBold = (str) => {
        let matched = str.substring(0, drinkInputValue.length);
        let makeBold = `<strong>${matched}</strong>`;
        let boldedMatch = str.replace(matched, makeBold);
        return boldedMatch;
    }

    const removeBold = (str) => {
        //replace < and > all characters between
        return str.replace(/<(.)*?>/g, "");
        // return str.replace(/<(strong)>/g, "").replace(/<\/(strong)>/g, "");
    }

    let hiLiteIndex = null;
    $: hiLitedCafe = filteredDrinks[hiLiteIndex];

    const navigateList = (e) => {
        if (e.key === "ArrowDown" && hiLiteIndex <= filteredDrinks.length-1) {
            hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1
        } else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
            hiLiteIndex === 0 ? hiLiteIndex = filteredDrinks.length-1 : hiLiteIndex -= 1
        } else if (e.key === "Enter") {
            setDrinkInputVal(filteredDrinks[hiLiteIndex]);
        } else {
            return;
        }
    }

    let new_param = "";
    let param_added = false;
    const addParam = () => {
        if (new_param) {
            weightObj[new_param] = 0;
            new_param = "";
        }
        param_added = !param_added;
    }
</script>

<h1> {cafeName} </h1>
<!--Autocomplete for the drink, if a second rating is added for the same drink then load in the information for modification-->
<div>
    <h1> Add a Rating </h1>
    <!-- Add a text input drop down-->
    <form autocomplete="off" on:submit|preventDefault={submitValue}>
        <div class="autocomplete">
            <input id="drink-input"
                   type="text"
                   placeholder="Search Drinks"
                   bind:this={drinkSearchInput}
                   bind:value={drinkInputValue}
                   on:input={filterDrinks}>
        </div>

        <!-- Filtered List Of Cafes -->
        {#if filteredDrinks.length > 0}
            <ul id="autocomplete-items-list">
                {#each filteredDrinks as drink, i}
                    <ListItem itemLabel={drink} highlighted={i === hiLiteIndex} on:click={() => setDrinkInputVal(drink)} />
                {/each}
            </ul>
        {/if}

        {#key param_added}
            {#each Object.entries(weightObj) as [param, weight]}
                <label for={param}>{param}</label>
                <input type="number" id={param} name={param} min="0" max="10" step="0.1" value={weight}/>
            {/each}
        {/key}
        <input type="text" id="new-param" name="new-param" placeholder="New Parameter" value={new_param}/>
        <button on:click={addParam}> Add new Parameter </button>

        <input type="submit" value="Lookup Cafe">
    </form>
</div>


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