<script lang="ts">
    import ListItem from "./ListItem.svelte";

    export let itemLabel;
    export let highlighted;
    import { useLocation } from "svelte-navigator";
    import { data, uid } from "./store.ts";
    import firebase from "firebase/compat/app";
    import "firebase/compat/auth";
    import "firebase/compat/firestore";

    const location = useLocation();

    let cafeObj = $location.state.cafe;

    let cafeName = cafeObj.name;

    let weightObj = cafeObj.weights;
    let drinkObjs = cafeObj.drinks;


    let ratingObj = JSON.parse(JSON.stringify(weightObj));
    for (let [param_rate, rating] of Object.entries(weightObj)) {
        ratingObj[param_rate] = 0.0;
    }

    let drinks = [];
    drinkObjs.forEach(drink => {
        drinks.push(drink.name);
    });

    let drink_name: string;
    let drink_price: number;

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
        let drink_object = drinkObjs.find(obj => obj["name"] === drinkInputValue);
        console.log("HEloo");
        for (let [param_rate, rating] of Object.entries(weightObj)) {
            document.getElementById(param_rate).value = drink_object.ratingValues[param_rate];
        }
        document.getElementById("drink_price").value = drink_object.price;
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
                drinkObj = {name: drinkInputValue, rating: 0.0, ratingValues: JSON.parse(JSON.stringify(weightObj)), price: 0.0};
                for (let [param_rate, rating] of Object.entries(weightObj)) {
                    drinkObj.ratingValues[param_rate] = 0.0;
                }
                cafeObj.drinks.push(drinkObj);
            }
            // Add the new rating to the drink object
            let ratingSum = 0;
            // console.log(ratingObj);
            for (let [param_rate, rating] of Object.entries(ratingObj)) {
                drinkObj.ratingValues[param_rate] = parseFloat(document.getElementById(param_rate).value);
                ratingSum += drinkObj.ratingValues[param_rate] * weightObj[param_rate];
            }
            drink_price = parseFloat(document.getElementById("drink_price").value);
            drinkObj.rating = ratingSum / (drink_price**2);
            console.log(drinkObj.rating);
            drinkObj.price = drink_price;
            // Update the cafe rating
            let cafeRatingSum = 0;
            cafeObj.drinks.forEach(drink => {
                cafeRatingSum += drink.rating;
            });
            cafeObj.rating = cafeRatingSum / cafeObj.drinks.length;
            // Update the cafe object in the store
            let cafeDataObj = $data.cafeTable.find(obj => obj["name"] === cafeName);
            cafeDataObj.drinks = cafeObj.drinks;
            cafeDataObj.rating = cafeObj.rating;
            // Update firebase
            const db = firebase.firestore();
            console.log($data.cafeTable);
            db.collection("users").doc($uid).delete();
            db.collection("users").doc($uid).set($data);
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

        <h3> Enter Rankings </h3>
        {#each Object.entries(ratingObj) as [param_rate, rating]}
            <label for={param_rate}>{param_rate}</label>
            <input type="number" id={param_rate} name={param_rate} min="0" max="10" step="0.1" value=0.0 />
        {/each}

        <label> Price (CAD without Tax) </label>
        <input type="number" id="drink_price" name="drink_price" min="0" step="0.01" value=0.0 />

        <input type="submit" value="Add Drink Rating">
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