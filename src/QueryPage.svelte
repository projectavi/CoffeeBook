<script>
    import { useLocation } from 'svelte-navigator';
    import RouteTransition from "./RouteTransition.svelte";

    const location = useLocation();

    let query = $location.state;

    let coltwo, colthree, colfour, colfive;

    let raw_data = query.data;

    let table_data = [];
    let pricepoint;

    if (query.level === "User") {
        if (query.type === "Cafe") {
            coltwo = "Best Drink(s)";
            colthree = "Rating";
            colfour = "Average Price";
            colfive = "Recommended";
            raw_data.forEach((obj) => {
                let temp = {};
                temp.name = obj.name;
                temp.rating = obj.rating;
                if (query.type === "Drink") {
                    temp.pricepoint = obj.price;
                } else {
                    pricepoint = 0;
                    obj.drinks.forEach((drink) => {
                        pricepoint += drink.price;
                    })
                    pricepoint = pricepoint / obj.drinks.length;
                    temp.pricepoint = pricepoint.toFixed(2);
                }

                temp.coltwo = "No Drinks Added";
                let max_rating = -1;
                temp.comment = "Recommended Drinks: ";
                obj.drinks.forEach((drink) => {
                    if (drink.recommend === true) {
                        if (temp.comment === "Recommended Drinks: ") {
                            temp.comment = temp.comment + drink.name;
                        }
                        else {
                            temp.comment = temp.comment + ", " + drink.name;
                        }
                    }
                    if (drink.rating >= max_rating) {
                        max_rating = drink.rating;
                        temp.coltwo = drink.name;
                    }
                })
                let name = temp.coltwo;
                obj.drinks.forEach((drink) => {
                    if (drink.rating >= max_rating) {
                        if (drink.name !== name) {
                            temp.coltwo = temp.coltwo + ", " + drink.name;
                        }
                    }
                })

                if (obj.recommend === true) {
                    temp.recommended_text = "Yes";
                } else {
                    temp.recommended_text = "No";
                }
                // temp.comment = ""; // This is for the comment/description field which I haven't implemented yet
                console.log(temp.comment);
                table_data.push(temp);
            });
        }
        else if (query.type === "Drink") {
            coltwo = "Cafe";
            colthree = "Rating";
            colfour = "Price";
            colfive = "Recommended";
            raw_data.forEach((cafe) => {
                cafe.drinks.forEach((drink) => {
                    let temp = {};
                    temp.name = drink.name;
                    temp.rating = drink.rating;
                    temp.pricepoint = drink.price;
                    if (drink.recommend === true) {
                        temp.recommended_text = "Yes";
                    } else {
                        temp.recommended_text = "No";
                    }
                    temp.coltwo = cafe.name;
                    table_data.push(temp);
                })
            })
        }
    }

</script>
<RouteTransition>
<main id="main">
    <div id="title-p">
        <h1> {query.level} {query.type} Rankings </h1>
    </div>
    <body>
    <section class="wrapper">
        <!-- Row title -->
        <main class="row title">
            <ul>
                <li>{query.type}</li>
                <li>{coltwo}</li>
                <li>{colthree}</li>
                <li>{colfour}</li>
                <li>{colfive}</li>
            </ul>
        </main>
        <!-- Row 1 - fadeIn -->
        {#each table_data as item}
        <section class="row-fadeIn-wrapper">
            <article class="row fadeIn nfl">
                <ul>
                    <li><a href="#"> {item.name} </a><span class="small"></span></li>
                    <li> {item.coltwo} </li>
                    <li> {item.rating} </li>
                    <li> {item.pricepoint} </li>
                    <li> {item.recommended_text} </li>
                </ul>
                <ul class="more-content">
                    <li> {item.comment} </li>
                </ul>
            </article>
        </section>
        {/each}
    </section>
    </body>
</main>
</RouteTransition>
<style lang="scss">
  /* Google fonts - Open Sans */
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);
  /* colors */
  $blue:rgba(79,192,210,1);
  $green:rgba(82,210,154,1);
  $yellow:rgba(231,196,104,0.7);
  $orange:rgba(235,118,85,1);
  $dark-bg:rgba(0,0,0,0.9);
  $light-bg:rgba(255,255,255,0.1);
  $text:rgba(255,255,255,0.9);

    #main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;

        background-color: #03254E;
    }

    #title-p {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 10vh;
        width: 100vw;

        color: #FFFFFF;
        margin-bottom: 2vh;

        background-color: #03254E;
    }

    body {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80vh;
        width: 70vw;

        border-radius: 25px;

        /*margin-bottom: 10vh;*/

        overflow-y: hidden;

        //background-color: #ffffff;

        background:$dark-bg;
        font-family: 'Open Sans', sans-serif;
    }

    /* links */
    .nfl a, .mlb a, .nhl a, .pga a {text-decoration:none;transition: color 0.2s ease-out;}
    .nfl a {color:$blue;}
    .nfl a:hover {color:darken($blue, 20%);}
    .mlb a {color:$green;}
    .mlb a:hover {color:darken($green, 20%);}
    .nhl a {color:$yellow;}
    .nhl a:hover {color:darken($yellow, 20%);}
    .pga a {color:$orange;}
    .pga a:hover {color:darken($orange, 20%);}

    /* wrapper */
    .wrapper {
      width:100%;
      height: 100%;
      border-radius: 25px;
      //max-width:1000px;
      //margin:20px auto 100px auto;
      padding:0;
      background:$light-bg;
      color:$text;
      overflow:hidden;
      position:relative;
    }

    /* lists */
    .row ul {
      margin:0;
      padding:0;
    }
    .row ul li  {
      margin:0;
      font-size:16px;
      font-weight:normal;
      list-style:none;
      display:inline-block;
      width:20%;
      box-sizing:border-box;
      @media only screen and (max-width:767px) and (min-width:480px) {
        font-size:13px;
      }
      @media only screen and (max-width:479px) {
        font-size:13px;
      }
    }

    .title ul li {
      padding:15px 13px;
    }
    .row ul li {
      padding:5px 10px;
    }

    /* rows */
    .row {
      padding:20px 0;
      height:30px;
      font-size:0;
      position:relative;
      overflow:hidden;
      transition:all 0.2s ease-out;
      border-top:1px solid darken($light-bg, 100%);
    }
    .row:hover {
      background-color:lighten($dark-bg, 10%);
      height:65px;
      @media only screen and (max-width : 767px) {
        height:85px;
      }
      @media only screen and (max-width : 359px) {
        height:105px;
      }
    }
    .title {
      padding:25px 0 5px 0;
      height:45px;
      font-size:0;
      background-color:$light-bg;
      border-left:3px solid lighten($light-bg, 100%);
    }
    .title:hover {
      height:45px;
      background-color:$light-bg;
      border-left:3px solid lighten($light-bg, 100%);
    }

    .title-hide {
      @media only screen and (max-width:767px) {
        display:none;
      }
    }

    .nfl {border-left:3px solid darken($blue, 30%);}
    .nfl:hover {border-left:3px solid $blue;}
    .mlb {border-left:3px solid darken($green, 30%);}
    .mlb:hover {border-left:3px solid $green;}
    .nhl {border-left:3px solid darken($yellow, 30%)}
    .nhl:hover {border-left:3px solid $yellow;}
    .pga {border-left:3px solid darken($orange, 30%);}
    .pga:hover {border-left:3px solid $orange;}

    /* row one - fadeIn */
    .row-fadeIn-wrapper {
      opacity:0;
      font-size:0;
      height:0;
      overflow:hidden;
      position:relative;
      transition:all 0.2s ease-out;
      animation:fadeIn 0.4s ease-out 2s 1 alternate;
      animation-fill-mode:forwards;
    }
    .row-fadeIn-wrapper:hover {
      height:35px;
      @media only screen and (max-width : 767px) {
        height:55px;
      }
      @media only screen and (max-width : 359px) {
        height:75px;
      }
    }

    .fadeIn {
      padding:20px 0;
      font-size:0;
      position:absolute;
      transition:all 0.2s ease-out;
      width:100%;
    }
    .fadeIn:hover {
      background-color:lighten($dark-bg, 10%);
    }

    /* row two - fadeOut */
    .row-fadeOut-wrapper {
      font-size:0;
      overflow:hidden;
      position:relative;
      transition:all 0.2s ease-out;
      animation:fadeOut 0.4s ease-out 8s 1 alternate;
      animation-fill-mode:forwards;
      opacity:1;
      height:65px;
    }
    .row-fadeOut-wrapper:hover {
      height:100px;
    }

    /* update content */
    .update-row {
      animation:update 0.5s ease-out 12s 1 alternate;
    }
    .update1 {
      position:absolute;
      top:25px;
      display:inline-block;
      opacity:1;
      animation:update1 1s ease-out 12s 1 alternate;
      animation-fill-mode:forwards;
    }
    .update2 {
      position:absolute;
      top:25px;
      display:inline-block;
      opacity:0;
      animation:update2 4s ease-out 13s 1 alternate;
      animation-fill-mode:forwards;
    }

    /* more content */
    ul.more-content li {
      position:relative;
      top:22px;
      font-size:13px;
      margin:0;
      padding:10px 13px;
      display:block;
      height:50px;
      width:100%;
      color:darken($text,50%);
      @media only screen and (max-width:767px) {
        font-size:11px;
      }
    }

    /* small content */
    .small {
      color:darken($text,60%);
      font-size:10px;
      padding:0 10px;
      margin:0;
      @media only screen and (max-width:767px) {
        display:none;
      }
    }

    /* keyframe animations */
    @keyframes fadeIn {
      from {background:$light-bg;opacity:0;padding:0;}
      to {background:darken($light-bg,80%);opacity:1;padding:0 0 65px 0;}
    }
    @keyframes fadeOut {
      from {background:darken($light-bg,80%);opacity:1;height:65px;}
      to {background:$light-bg;opacity:0;height:0;}
    }
    @keyframes update {
      0% {background:darken($light-bg,80%);}
      50% {background:$light-bg;}
      100% {background:darken($light-bg,80%);}
    }
    @keyframes update1 {
      0% {opacity:0;}
      0% {opacity:1;}
      100% {opacity:0;}
    }
    @keyframes update2 {
      0% {opacity:0;color:$text;}
      20% {opacity:1;color:$green;}
      100% {opacity:1;color:$text;}
    }
</style>