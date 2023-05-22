<script lang="ts">
    import ListItem from "./ListItem.svelte";
    import RouteTransition from "./RouteTransition.svelte";

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
        document.getElementById("recommend").checked = drink_object.recommend;
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
                drinkObj = {name: drinkInputValue, rating: 0.0, ratingValues: JSON.parse(JSON.stringify(weightObj)), price: 0.0, recommend: false};
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
            drinkObj.recommend = document.getElementById("recommend").checked;
            drinkObj.rating = parseFloat((ratingSum / (drink_price**2)).toFixed(2));
            console.log(drinkObj.rating);
            drinkObj.price = drink_price;
            // Update the cafe rating
            let cafeRatingSum = 0;
            cafeObj.drinks.forEach(drink => {
                cafeRatingSum += drink.rating;
            });
            cafeObj.rating = (cafeRatingSum / cafeObj.drinks.length).toFixed(2);
            console.log(cafeObj.rating);
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
<RouteTransition>
<main>
    <div id="titlesection">
<h1 style="text-align: center"> {cafeName} </h1>
    <div id="cafe-info">
        <h3 class="tenmargin"> Overall Score: {cafeObj.rating} </h3>
        {#if cafeObj.recommend}
            <h3 class="tenmargin"> <b> Recommended </b> </h3>
        {/if}
    </div>
    </div>
<body>
<!--Autocomplete for the drink, if a second rating is added for the same drink then load in the information for modification-->
<div id="new">
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

        <label> Recommend? </label>
        <input type="checkbox" id="recommend" name="recommend" value="recommend?"/>

        <input type="submit" value="Add Drink Rating">
    </form>
</div>

<div id="table">
    <h1> Rating Table </h1>

    <table id="table_items">
        <tr>
            <th> Drink Name </th>
            {#each Object.entries(weightObj) as [param_rate, rating]}
                <th> {param_rate} </th>
            {/each}
            <th> Price </th>
            <th> Rating </th>
            <th> Recommend? </th>
        </tr>
        {#each cafeObj.drinks as drink}
            <tr>
                <td> {drink.name} </td>
                {#each Object.entries(drink.ratingValues) as [param_rate, rating]}
                    <td> {rating} </td>
                {/each}
                <td> {drink.price} </td>
                <td> {drink.rating} </td>
                {#if drink.recommend}
                    <td> Yes </td>
                {:else}
                    <td> No </td>
                {/if}
            </tr>
        {/each}
    </table>
</div>
</body>
</main>
</RouteTransition>
<style lang="scss">
    main {
        background-image: url("https://unsplash.com/photos/-FVaZbu6ZAE/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjg0NzU2ODU1fA&force=true");
        background-size: cover;
        background-repeat: no-repeat;

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        /*    Fill Page*/
        height: 100vh;
        width: 100vw;
    }

    body {
    /*    Set horizontal layout */
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    #titlesection {
        margin-top: 5vh;
        color: #ffffff;
    }

    #cafe-info {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    #table {
        padding-right: 33vh;
        padding-bottom: 35vh;
    }

    #new {
        padding-left: 60vh;
        padding-bottom: 8vh;
    }

    .tenmargin {
        margin: 10px;
    }

    #table_items {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    #table_items td, #table_items th {
        padding: 8px;
    }

    #table_items tr:nth-child(even){background-color: #f2f2f2;}

    #table_items tr:hover {background-color: #ddd;}

    #table_items th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #04AA6D;
        color: white;
    }

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