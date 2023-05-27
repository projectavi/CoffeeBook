<script lang="ts">
    import ListItem from "./ListItem.svelte";
    import RouteTransition from "./RouteTransition.svelte";

    export let itemLabel;
    export let highlighted;
    import {navigate, useLocation} from "svelte-navigator";
    import { data, uid } from "./store.ts";
    import firebase from "firebase/compat/app";
    import "firebase/compat/auth";
    import "firebase/compat/firestore";

    const location = useLocation();

    let cafeObj = $location.state.cafe;

    console.log(cafeObj.recommend);

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
            drinkObj.rating = parseFloat((ratingSum / ( Math.abs(cafeObj.priceWeight) * (drink_price**2))).toFixed(2));
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

    const edit_preferences = () =>  {
        navigate("/preferences", {state: {cafe: cafeObj}});
    }
</script>
<RouteTransition>
<!--<main>-->
<!--    <div id="titlesection">-->
<!--<h1 style="text-align: center"> {cafeName} </h1>-->
<!--    <div id="cafe-info">-->
<!--        <h3 class="tenmargin"> Overall Score: {cafeObj.rating} </h3>-->
<!--        {#if cafeObj.recommend}-->
<!--            <h3 class="tenmargin"> <b> Recommended </b> </h3>-->
<!--        {/if}-->
<!--        <img width="24" height="24" src="https://img.icons8.com/material-two-tone/24/settings.png" alt="settings" on:click={edit_preferences} />-->
<!--    </div>-->
<!--    </div>-->
<!--<body class="notepad">-->
<!--&lt;!&ndash;Autocomplete for the drink, if a second rating is added for the same drink then load in the information for modification&ndash;&gt;-->
<!--<div id="new">-->
<!--    <h1> Rate a Drink </h1>-->
<!--    &lt;!&ndash; Add a text input drop down&ndash;&gt;-->
<!--&lt;!&ndash;    <form autocomplete="off" on:submit|preventDefault={submitValue}>&ndash;&gt;-->
<!--        <div class="autocomplete">-->
<!--            <input style="width: 100%" id="drink-input"-->
<!--                   type="text"-->
<!--                   placeholder="Search Drinks"-->
<!--                   bind:this={drinkSearchInput}-->
<!--                   bind:value={drinkInputValue}-->
<!--                   on:input={filterDrinks}>-->
<!--        </div>-->

<!--        &lt;!&ndash; Filtered List Of Cafes &ndash;&gt;-->
<!--        {#if filteredDrinks.length > 0}-->
<!--            <ul style="z-index: 1" id="autocomplete-items-list">-->
<!--                {#each filteredDrinks as drink, i}-->
<!--                    <ListItem itemLabel={drink} highlighted={i === hiLiteIndex} on:click={() => setDrinkInputVal(drink)} />-->
<!--                {/each}-->
<!--            </ul>-->
<!--        {/if}-->

<!--        <div class="tag-body">-->
<!--            {#each Object.entries(ratingObj) as [param_rate, rating]}-->
<!--                <div class="box shadow">-->
<!--                    <div class="circle"> </div>-->
<!--                <label for={param_rate}>{param_rate}</label>-->
<!--                <input type="number" id={param_rate} name={param_rate} min="0" max="10" step="0.1" value=0.0 />-->
<!--                </div>-->
<!--            {/each}-->
<!--        <div class="box shadow">-->
<!--            <div class="circle"> </div>-->
<!--        <label> Price (CAD) </label>-->
<!--        <input type="number" id="drink_price" name="drink_price" min="0" step="0.01" value=0.0 />-->
<!--        </div>-->

<!--        <div class="box shadow">-->
<!--            <div class="circle"> </div>-->
<!--        <label> Recommend? </label>-->
<!--        <input type="checkbox" id="recommend" name="recommend" value="recommend?"/>-->
<!--        </div>-->
<!--        </div>-->

<!--&lt;!&ndash;        <input type="submit" value="Add Drink Rating">&ndash;&gt;-->
<!--    <button style="width: 100%" on:click={submitValue}> Add Drink Rating </button>-->
<!--&lt;!&ndash;    </form>&ndash;&gt;-->

<!--</div>-->

<!--<div id="table">-->
<!--    <h1> Rating Table </h1>-->

<!--    <table id="table_items">-->
<!--        <tr>-->
<!--            <th> Drink Name </th>-->
<!--            {#each Object.entries(weightObj) as [param_rate, rating]}-->
<!--                <th> {param_rate} </th>-->
<!--            {/each}-->
<!--            <th> Price </th>-->
<!--            <th> Rating </th>-->
<!--            <th> Recommend? </th>-->
<!--        </tr>-->
<!--        {#each cafeObj.drinks as drink}-->
<!--            <tr>-->
<!--                <td> {drink.name} </td>-->
<!--                {#each Object.entries(drink.ratingValues) as [param_rate, rating]}-->
<!--                    <td> {rating} </td>-->
<!--                {/each}-->
<!--                <td> {drink.price} </td>-->
<!--                <td> {drink.rating} </td>-->
<!--                {#if drink.recommend}-->
<!--                    <td> Yes </td>-->
<!--                {:else}-->
<!--                    <td> No </td>-->
<!--                {/if}-->
<!--            </tr>-->
<!--        {/each}-->
<!--    </table>-->
<!--</div>-->
<!--</body>-->
<!--</main>-->

    <main>
        <div id="titlesection">
            <h1 style="text-align: center"> {cafeName} </h1>
            <div id="cafe-info">
                <h3 class="tenmargin"> Overall Score: {cafeObj.rating} </h3>
                {#if cafeObj.recommend}
                    <h3 class="tenmargin"> <b> Recommended </b> </h3>
                {/if}
                <img width="72" height="72" src="https://img.icons8.com/clouds/100/apple-settings--v2.png" alt="settings" on:click={edit_preferences} />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <!--Autocomplete for the drink, if a second rating is added for the same drink then load in the information for modification-->
                <div class="col col-items">
                    <h1 class="col-items"> Rate a Drink </h1>
                    <!-- Add a text input drop down-->
                    <!--    <form autocomplete="off" on:submit|preventDefault={submitValue}>-->
                    <div class="autocomplete col-items" style="width: 100%">
                        <input style="width: 100%" id="drink-input"
                               type="text"
                               placeholder="Search Drinks"
                               bind:this={drinkSearchInput}
                               bind:value={drinkInputValue}
                               on:input={filterDrinks}>
                    </div>

                    <!-- Filtered List Of Cafes -->
                    {#if filteredDrinks.length > 0}
                        <ul style="z-index: 1; color: black;" id="autocomplete-items-list">
                            {#each filteredDrinks as drink, i}
                                <ListItem style="color: #000000" itemLabel={drink} highlighted={i === hiLiteIndex} on:click={() => setDrinkInputVal(drink)} />
                            {/each}
                        </ul>
                    {/if}

                    <div class="tag-body col-items scroll">
                        {#each Object.entries(ratingObj) as [param_rate, rating]}
                            <div class="box shadow">
                                <div class="circle"> </div>
                                <label for={param_rate}>{param_rate}</label>
                                <input type="number" id={param_rate} name={param_rate} min="0" max="10" step="0.1" value=0.0 />
                            </div>
                        {/each}
                        <div class="box shadow col-items">
                            <div class="circle"> </div>
                            <label> Price (CAD) </label>
                            <input type="number" id="drink_price" name="drink_price" min="0" step="0.01" value=0.0 />
                        </div>

                        <div class="box shadow col-items">
                            <div class="circle"> </div>
                            <label> Recommend? </label>
                            <input type="checkbox" id="recommend" name="recommend" value="recommend?"/>
                        </div>
                    </div>

                    <!--        <input type="submit" value="Add Drink Rating">-->
<!--                    <button class="col-items" style="width: 100%" on:click={submitValue}> Add Drink Rating </button>-->
                    <!--    </form>-->

                    <div class="container" style="width: 100%" on:click={submitValue}>

                        <a href="#" class="button">
                            <div class="button__line"></div>
                            <div class="button__line"></div>
                            <span class="button__text"> Add Drink Rating </span>
                            <div class="button__drow1"></div>
                            <div class="button__drow2"></div>
                        </a>

                    </div>

                </div>
            </div>
            <div class="col">
                <div class="col col-items">
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
                            <tr style="color: black">
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
            </div>
        </div>
    </main>
</RouteTransition>
<style lang="scss">
    main {
        //background-image: url("https://unsplash.com/photos/-FVaZbu6ZAE/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjg0NzU2ODU1fA&force=true");
        //background-image: url("https://unsplash.com/photos/hD9nj1vvVgk/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y29mZmVlJTIwYW5kJTIwcGFwZXJ8ZW58MHx8fHwxNjg0NzgxMDc3fDA&force=true");
        background-image: url("https://unsplash.com/photos/1Bg9Wlq3wXk/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8d29vZGVuJTIwZGVza3xlbnwwfHx8fDE2ODUxOTAyNDR8MA&force=true");
        background-size: contain;
        //background-repeat: no-repeat;

        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        /*    Fill Page*/
        height: 100vh;
        width: 100vw;
      z-index: -2;
    }

    tr {
      background-color: #8c6666;
    }

    body {
    /*    Set horizontal layout */
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .scroll {
      overflow-y: hidden;
    }

    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: baseline;
      color: #ffffff;
      height: 90%;
      width: 100%;
    }

    .col {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      color: #ffffff;
    }

    .col-items {
      display: flex;
      justify-content: center;
    }

    #titlesection {

        color: #ffffff;
      font-size: 200%;
      margin-bottom: -5vh;
    }

    #cafe-info {
      margin-top: -4vh;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      color: #ffffff;
      font-size: 50%;
    }

    #table {
        padding-right: 15vh;
        padding-bottom: 47vh;
      overflow: hidden;
      overflow-y:auto;
      overflow-x:auto;
      max-height: 100%;
    }

    #new {
      max-height: 100%;
      overflow: hidden;
      overflow-y:auto;
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
        background-color: #333333;
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
        background-color: #453333;
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

    input {
      width: 10vh;
    }

    label {
      padding-bottom: 3vh;
    }

    @import url('https://fonts.googleapis.com/css?family=PT+Mono');

    html {
      box-sizing: border-box;
      font: 18px PT Mono;
      background: antiquewhite;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    .tag-body {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .box {
        width: auto;
        min-width: 250px;
        display: flex;
        height: 40px;
        position: relative;
        border-radius: 5px;
        background: linear-gradient(to right, #333333 35%, #453333 100%);
        margin-bottom: 10px;
        padding: 15px 25px 0 40px;
        color: white;
      font-weight: 500;
      font-size: 100%;
        box-shadow: 1px 2px 1px -1px #777;
        transition: background 200ms ease-in-out;

          flex-direction: row;
          justify-content: space-around;
          align-items: center;
    }

    .shadow {
        position: relative;
        &:before {
          z-index: -1;
          position: absolute;
          content: "";
          bottom: 13px;
          right: 7px;
          width: 25%;
          top: 0;
          box-shadow: 0 15px 10px #777;
          transform: rotate(4deg);
          transition: all 150ms ease-in-out;
        }
    }

    .box:hover {
        background: linear-gradient(to right, #333333 0%, #333333 100%);
    }

    .shadow:hover::before {
      transform: rotate(0deg);
      bottom: 20px;
      z-index: -10;
    }

    .circle {
        position: absolute;
        top: 14px;
        left: 15px;
        border-radius: 50%;
        box-shadow: inset 1px 1px 1px 0px rgba( 0, 0, 0, .5), inset 0 0 0 25px antiquewhite;
        width: 20px;
        height: 20px;
        display: inline-block;
    }

    @import "../node_modules/compass-mixins/lib/compass";

    $linespace: 30px;

    .notepad {
      //z-index:1;
      position: relative;
      width: 60%;
      padding: 30px;
      margin: 100px auto;
      text-align: center;
      background-color: #f6f6f6;
      height: 70%;
      @include background(linear-gradient(top, rgba(#F6F6F6, 0), #FCFCFC), linear-gradient(top, rgba(#F6F6F6, 1), rgba(#F6F6F6, 1) $linespace, #EAEAEA $linespace, #EAEAEA $linespace + 1px));

      background-size: 80%, 80% $linespace + 1px;
      box-shadow: 0 4px 4px rgba(0,0,0,0.2);
    }

    .notepad:before {
      content: '';
      height: 47px;
      width: 100%;
      position: absolute;
      top: -45px;
      left: 0;
      background: url('https://i.ibb.co/b7g0Ygy/Paper-BG-removed2.png') repeat-x;
      background-size: 400px auto;
      //box-shadow: 0 10px 4px rgba(black, 0.2);
      //z-index: -1;
    }

    h3 {
      font-size: 2em;
      font-family: Helvetica;
      color: #ffffff;
    }

    .button{
      position : relative ;
      z-index : 0 ;
      width : 240px ;
      height : 56px ;
      text-decoration : none ;
      font-size : 14px ;
      font-weight : bold ;
      color : #ffffff ;
      letter-spacing : 2px ;
      transition : all .3s ease ;
    }
    .button__text{
      display : flex ;
      justify-content : center ;
      align-items : center ;
      width : 100% ;
      height : 100% ;
    }
    .button::before,
    .button::after,
    .button__text::before,
    .button__text::after{
      content : '' ;
      position : absolute ;
      height : 3px ;
      border-radius : 2px ;
      background : #ffffff ;
      transition : all .5s ease ;
    }
    .button::before{
      top : 0 ;
      left : 54px ;
      width : calc( 100% - 56px * 2 - 16px ) ;
    }
    .button::after{
      top : 0 ;
      right : 54px ;
      width : 8px ;
    }
    .button__text::before{
      bottom : 0 ;
      right : 54px ;
      width : calc( 100% - 56px * 2 - 16px ) ;
    }
    .button__text::after{
      bottom : 0 ;
      left : 54px ;
      width : 8px ;
    }
    .button__line{
      position : absolute ;
      top : 0 ;
      width : 56px ;
      height : 100% ;
      overflow : hidden ;
    }
    .button__line::before{
      content : '' ;
      position : absolute ;
      top : 0 ;
      width : 150% ;
      height : 100% ;
      box-sizing : border-box ;
      border-radius : 300px ;
      border : solid 3px #ffffff ;
    }
    .button__line:nth-child(1),
    .button__line:nth-child(1)::before{
      left : 0 ;
    }
    .button__line:nth-child(2),
    .button__line:nth-child(2)::before{
      right : 0 ;
    }
    .button:hover{
      letter-spacing : 6px ;
    }
    .button:hover::before,
    .button:hover .button__text::before{
      width : 8px ;
    }
    .button:hover::after,
    .button:hover .button__text::after{
      width : calc( 100% - 56px * 2 - 16px ) ;
    }
    .button__drow1,
    .button__drow2{
      position : absolute ;
      z-index : -1 ;
      border-radius : 16px ;
      transform-origin : 16px 16px ;
    }
    .button__drow1{
      top : -16px ;
      left : 40px ;
      width : 32px ;
      height : 0;
      transform : rotate( 30deg ) ;
    }
    .button__drow2{
      top : 44px ;
      left : 77px ;
      width : 32px ;
      height : 0 ;
      transform : rotate(-127deg ) ;
    }
    .button__drow1::before,
    .button__drow1::after,
    .button__drow2::before,
    .button__drow2::after{
      content : '' ;
      position : absolute ;
    }
    .button__drow1::before{
      bottom : 0 ;
      left : 0 ;
      width : 0 ;
      height : 32px ;
      border-radius : 16px ;
      transform-origin : 16px 16px ;
      transform : rotate( -60deg ) ;
    }
    .button__drow1::after{
      top : -10px ;
      left : 45px ;
      width : 0 ;
      height : 32px ;
      border-radius : 16px ;
      transform-origin : 16px 16px ;
      transform : rotate( 69deg ) ;
    }
    .button__drow2::before{
      bottom : 0 ;
      left : 0 ;
      width : 0 ;
      height : 32px ;
      border-radius : 16px ;
      transform-origin : 16px 16px ;
      transform : rotate( -146deg ) ;
    }
    .button__drow2::after{
      bottom : 26px ;
      left : -40px ;
      width : 0 ;
      height : 32px ;
      border-radius : 16px ;
      transform-origin : 16px 16px ;
      transform : rotate( -262deg ) ;
    }
    .button__drow1,
    .button__drow1::before,
    .button__drow1::after,
    .button__drow2,
    .button__drow2::before,
    .button__drow2::after{
      background : var( --back_color ) ;
    }
    .button:hover .button__drow1{
      animation : drow1 ease-in .06s ;
      animation-fill-mode : forwards ;
    }
    .button:hover .button__drow1::before{
      animation : drow2 linear .08s .06s ;
      animation-fill-mode : forwards ;
    }
    .button:hover .button__drow1::after{
      animation : drow3 linear .03s .14s ;
      animation-fill-mode : forwards ;
    }
    .button:hover .button__drow2{
      animation : drow4 linear .06s .2s ;
      animation-fill-mode : forwards ;
    }
    .button:hover .button__drow2::before{
      animation : drow3 linear .03s .26s ;
      animation-fill-mode : forwards ;
    }
    .button:hover .button__drow2::after{
      animation : drow5 linear .06s .32s ;
      animation-fill-mode : forwards ;
    }
    @keyframes drow1{
      0%   { height : 0 ; }
      100% { height : 100px ; }
    }
    @keyframes drow2{
      0%   { width : 0 ; opacity : 0 ;}
      10%  { opacity : 0 ;}
      11%  { opacity : 1 ;}
      100% { width : 120px ; }
    }
    @keyframes drow3{
      0%   { width : 0 ; }
      100% { width : 80px ; }
    }
    @keyframes drow4{
      0%   { height : 0 ; }
      100% { height : 120px ; }
    }
    @keyframes drow5{
      0%   { width : 0 ; }
      100% { width : 124px ; }
    }

    .container{
      width : 100% ;
      height : 75px ;
      display : flex ;
      flex-direction : column ;
      justify-content : center ;
      align-items : center ;
    }
</style>