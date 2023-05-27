<script lang="ts">
    import { navigate, useLocation } from "svelte-navigator";
    import firebase from "firebase/compat/app";
    import "firebase/compat/auth";
    import "firebase/compat/firestore";
    import { data, uid } from "./store.ts";
    import {onMount} from "svelte";
    import RouteTransition from "./RouteTransition.svelte";

    const location = useLocation();
    let cafeObj = $location.state.cafe;
    console.log(cafeObj.recommend);

    // Write an onmount function
    onMount(() => {
        document.getElementById("recommend").checked = cafeObj.recommend;
    });

    const go_back = () => {
        navigate("/cafe", { state: { cafe: cafeObj } });
    };

    const save_settings = () => {
        let weights = {};
        let priceWeight = parseFloat(document.getElementById("price").value);
        let recommend = document.getElementById("recommend").checked;
        for (let [parameter, weight] of Object.entries(cafeObj.weights)) {
            weights[parameter] = parseFloat((document.getElementById(parameter).value));
        }

        // Read cafeObj from store.ts
        let cafeDataObj = $data.cafeTable.find(obj => obj["name"] === cafeObj.name);
        cafeDataObj.weights = weights;
        cafeDataObj.priceWeight = priceWeight;
        cafeDataObj.recommend = recommend;

        const db = firebase.firestore();
        console.log($data.cafeTable);
        db.collection("users").doc($uid).delete();
        db.collection("users").doc($uid).set($data);

        navigate("/cafe", { state: { cafe: cafeDataObj } })
    }

    const add_parameter = () => {
        let new_param = document.getElementById("new_param").value;
        cafeObj.weights[new_param] = 0;
        save_settings();
    }
</script>
<RouteTransition>
<main>
    <div id="titlesection">
        <h1 style="text-align: center"> {cafeObj.name} </h1>
        <div id="cafe-info">
            <h3 class="tenmargin"> Overall Score: {cafeObj.rating} </h3>
        </div>
    </div>
    <body>
        {#each Object.entries(cafeObj.weights) as [parameter, weight]}
            <div class="box shadow">
                <div class="circle"> </div>
                <p> {parameter} </p>
                <input type="number" id={parameter} value={weight} />
            </div>
        {/each}
        <div class="box shadow">
            <div class="circle"></div>
                <p> Price </p>
                <input type="number" id="price" value={cafeObj.priceWeight} />
        </div>
        <div class="box shadow">
            <div class="circle"></div>
            <p> Recommend? </p>
            <input type="checkbox" id="recommend" checked={cafeObj.recommend} />
        </div>
    </body>
    <div class="col">
        <div class="row">
            <div class="container tenmargin">
                <input type="text" id="new_param" />
            </div>
            <div class="container" on:click={add_parameter}>

                <a href="#" class="button">
                    <div class="button__line"></div>
                    <div class="button__line"></div>
                    <span class="button__text"> ADD PARAMETER </span>
                    <div class="button__drow1"></div>
                    <div class="button__drow2"></div>
                </a>

            </div>
        </div>
        <div class="row">
            <div class="container" on:click={save_settings}>

                <a href="#" class="button">
                    <div class="button__line"></div>
                    <div class="button__line"></div>
                    <span class="button__text"> SAVE </span>
                    <div class="button__drow1"></div>
                    <div class="button__drow2"></div>
                </a>

            </div>
            <div class="container" on:click={go_back}>

                <a href="#" class="button">
                    <div class="button__line"></div>
                    <div class="button__line"></div>
                    <span class="button__text"> CANCEL </span>
                    <div class="button__drow1"></div>
                    <div class="button__drow2"></div>
                </a>

            </div>
        </div>
    </div>

</main>
</RouteTransition>
<style lang="scss">
  #new_param {
    margin-right: 5vh;
    margin-left: 1vh;
  }

  #titlesection {

    color: #ffffff;
    font-size: 200%;
    //margin-bottom: -5vh;
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

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .col {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    padding-bottom: 5vh;
  }

    main {

        background-image: url('https://unsplash.com/photos/iGAskcHIfVU/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTAwfHxkZXNrfGVufDB8fHx8MTY4NDg0OTIwOHwy&force=true');
        background-size: cover;
        background-repeat: no-repeat;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        height: 100vh;
        width: 100vw;
    }

    body {
        display: inline-grid;
        column-gap: 5%;
        //row-gap: 10%;
      margin: auto;
      //margin-top: 10vh;
      max-height: 60%;
      overflow-y:auto;
      justify-items: center;
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
      width: 20%;
      min-width: 100px;
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

    :root {
        /* color type A */
        --line_color : #555555 ;
        --back_color : #FFECF6  ;

        /* color type B */
        /* --line_color : #1b1919 ;
        --back_color : #E9ECFF  ; */

        /* color type C */
        /* --line_color : #00135C ;
        --back_color : #DEFFFA  ; */
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