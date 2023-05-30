<script lang="ts">
    import TransitionContainer from "./TransitionContainer.svelte";
    import { useLocation, navigate } from "svelte-navigator";

    const location = useLocation();

    let query_state = $location.state;
    let page_title = query_state.title;

    let info = [];

    if (query_state.level === "Global") {
        info.push({head: "Average Rating", body: query_state.data.tabled_data.rating});
        info.push({head: "Average Price", body: query_state.data.tabled_data.pricepoint});
        let rec_text = query_state.data.tabled_data.recommended_text;
        // Split the rec_text string using ":" as the delimiter
        let rec_text_split = rec_text.split(":");
        let text = rec_text_split[0].toString() + " out of " + (parseInt(rec_text_split[0]) + parseInt(rec_text_split[1])).toString() + " recommend this cafe.";
        info.push({head: "Recommendations", body: text });
        info.push({head: "Total Drinks Reviewed", body: query_state.data.tabled_data.coltwo}); // Temp before better data;
    }

    // TODO for global cafe view, add more buttons for more views on drinks and analytics, for user level decide what to do, make sure to restructure firestore to hold cafe information in another parallel collection because the current organisation is too computationally expensive, will have to maintain data concurrently but that might not be the worst thing I hope, will have to restructure both reading and especially writing queries. Also make sure to restructure this comment to make it readable. Additionally make sure to add global autocomplete for cafe and drink names so that cross user comparisons can be done.
</script>

<TransitionContainer>
    <main>
        <h1>{page_title}</h1>
<body style="--n: 4">
<svg class="hid">
    <symbol id="ico0" viewBox="-9 -9 98 98">
        <path class="d" d="M12 50h57"></path>
        <path d="M40 14h-32v42h64v-21" stroke-linejoin="round"></path>
        <path class="d t" d="M52 20h17"></path>
        <path d="M47 9a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h6v5l5-5h15a3 3 0 0 0 3-3v-16a3 3 0 0 0-3-3zM33 57v4M47 57v4M26 66v-1a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3v1z"></path>
    </symbol>
    <symbol id="ico1" viewBox="-9 -9 98 98">
        <path d="M8 17h64v22a6 6 0 0 1-6 6h-52a6 6 0 0 1-6-6zM8 39v28h64v-28M28 16v-4a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v4M34 10h13"></path>
        <path class="d" d="M12 47v16h56v-17"></path>
        <path class="d t" d="M40 38h1"></path>
        <path class="t" d="M27 16h2M51 16h2"></path>
    </symbol>
    <symbol id="ico2" viewBox="-9 -9 98 98">
        <path d="M10 33v37h60v-37M40 7l32 20v7l-32-20-32 20v-7zM32 26v10h16v-10zM40 27v8M32 69v-24h16v24"></path>
        <path class="d" d="M11 63h21M49 63h21"></path>
        <path class="d" d="M44 59h1" style="--s: 3"></path>
    </symbol>
    <symbol id="ico3" viewBox="-9 -9 98 98">
        <path class="d" d="M51 20v5"></path>
        <path class="d t" d="M32 46v1M48 46v1"></path>
        <path d="M22 51q0 15 15 19q3 2 6 0q15-4 15-19c4 0 2-1 4-5c1-2-2-4-4-3q1-13-7-15c-7 8-28 0-29 15c-2-1-5 1-4 3c2 4 0 5 4 5M20 42c-2-9 1-13-6-17q24-25 37-9q16 3 9 26"></path>
    </symbol>
</svg>
<section style="--c0: #fd4617; --c1: #ffc445">
    <h3>{info[0].head}</h3>
    <p>{info[0].body}</p>
    <div class="ico"><a href="#">
        <svg>
            <use xlink:href="#ico0"></use>
        </svg></a></div>
</section>
<section style="--c0: #ffaa5a; --c1: #fff05a">
    <h3>{info[1].head}</h3>
    <p>{info[1].body}</p>
    <div class="ico"><a href="#">
        <svg>
            <use xlink:href="#ico1"></use>
        </svg></a></div>
</section>
<section style="--c0: #96c93d; --c1: #00b09b">
    <h3>{info[2].head}</h3>
    <p>{info[2].body}</p>
    <div class="ico"><a href="#">
        <svg>
            <use xlink:href="#ico2"></use>
        </svg></a></div>
</section>
<section style="--c0: #3da5d9; --c1: #54f2f2">
    <h3>{info[3].head}</h3>
    <p>{info[3].body}</p>
    <div class="ico"><a href="#">
        <svg>
            <use xlink:href="#ico3"></use>
        </svg></a></div>
</section>
</body>
    </main>
</TransitionContainer>

<style lang="scss">
  $n: 4; // has to match number of items in HTML 😭
  $wmax: 12.5em;
  $wmin: 7.5em;
  $hgap: 2em;
  $ring: .625em;
  $wbar: .375em;
  $dosc: 2.875em;
  $line: 2px;
  $rad0: .5em;
  $rad1: .75*$rad0;
  $rad2: 1.25*$rad0;
  $rad3: .5*$rad0;
  $aamp: 8deg;

  * { margin: 0; font: inherit }

  %osc {
    border-radius: 50%;
    transform-origin: 50% 0;
    transform: rotate(-$aamp);
    animation: osc .3s ease-in-out infinite alternate
  }

  @keyframes osc { to { transform: rotate($aamp) } }

  main {
    // Column View
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 100vh;
    min-width: 100vw;

    color: #ffffff;

    background:
            linear-gradient(to right top, #ebedec, #e3e7e6, #dbe1e0, #d3dadb, #ccd4d6);
  }

  h1 {
    font-family: 'Roboto', sans-serif;
    font-weight: 800;
    font-size: 5.5em;
  }

  body {
    --narr: 1;
    --notnarr: calc(1 - var(--narr));
    --wide: 0;
    --notwide: calc(1 - var(--wide));
    --nor: calc(var(--notnarr)*var(--notwide));
    --or: calc(1 - var(--nor));
    --sum: calc(1 + var(--narr));
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    overflow-x: hidden;
    min-height: 100vh;
    background:
            linear-gradient(to right top, #ebedec, #e3e7e6, #dbe1e0, #d3dadb, #ccd4d6);

    &:before {
      --uw: calc(var(--nor)*(100% - var(--n)*#{$hgap})/var(--n) +
      var(--or)*#{$wmax});
      position: absolute;
      top: 50%; right: 0; left: 0;
      height: calc(var(--sum)*2*var(--uw));
      transform: translate(calc(var(--sum)*50%/var(--n)), -50%);
      background:
              radial-gradient(circle at calc(50% - #{2*$rad0}) calc(39% - #{2*$rad0}),
                      #fff calc(#{$rad3} - 1px), rgba(#fff, 0) $rad3),
              radial-gradient(circle at calc(50% + #{2*$rad0}) calc(39% - #{2*$rad0}),
                      #fff calc(#{$rad3} - 1px), rgba(#fff, 0) $rad3),
              radial-gradient(circle at 50% 39%,
                      #fff calc(#{$rad2} - 1px), rgba(#fff, 0) $rad2);
      background-size: calc(50%/(2 - var(--narr))) calc(100%/(1 + var(--narr)));
      clip-path: inset(0 calc(var(--sum)*25%) 0 0);
      filter: drop-shadow(5px 5px 4px rgba(#000, .2));
      content: '';

      @media (max-width: 480px) { display: none }
    }

    @media (min-width: $n*($wmin + $hgap)) { --narr: 0 }

    @media (min-width: $n*($wmax + $hgap)) { --wide: 1 }
  }

  .hid {
    position: absolute;
    clip-path: inset(50%);
  }

  path {
    --s: 2;
    fill: none;
    stroke: currentcolor;
    stroke-width: var(--s);
    stroke-linecap: round;

    &.d { stroke-dasharray: 0 calc(2*var(--s)) }

    &.t { --s: 4 }
  }

  section {
    display: flex;
    flex-direction: column;
    padding: 1em .5*$hgap;
    min-width: $wmin;
    width: calc(var(--nor)*(100% - var(--n)*#{$hgap})/var(--n) + var(--or)*#{$wmax});
    font-family: sans-serif;
    text-align: center;
    text-transform: uppercase
  }

  h3, a { color: var(--c0) }

  h3 {
    padding: 1em 0 .5em;
    font-size: calc(var(--nor)*2vw + var(--or)*1.16em)
  }

  p { height: 3em; font-size: .75em }

  .ico {
    order: -1;
    position: relative;
    margin-bottom: calc(100% + #{$dosc} + #{$line});
    border-radius: 50%;
    box-shadow:
            inset 0 0 0 $ring #fff,
            11px 11px 12px -9px rgba(27, 14, 0, .28);
    background: linear-gradient(135deg, var(--c0), var(--c1)) padding-box;

    a {
      --sgn: 1;
      box-sizing: border-box;
      display: grid;
      place-content: center;
      padding: 50%;
      width: 0; height: 0;
      border-radius: 50%;
      clip-path: circle(calc(50% - #{$ring}));

      &:hover { --sgn: -1 }
    }

    svg {
      --w: calc(100% - #{2*$hgap});
      box-sizing: border-box;
      position: absolute;
      margin: calc(-.5*var(--w));
      border: solid .5*$hgap transparent;
      width: var(--w); height: var(--w);
      border-radius: 50%;
      @extend %osc;
      box-shadow: calc(var(--sgn)*36px) 27px 11px -5px rgba(27, 14, 0, .16);
      background: linear-gradient(135deg, #fff, #d2d2d2) border-box;
      transition: .3s ease-out
    }

    &:before, &:after {
      position: absolute;
      content: ''
    }

    &:before {
      box-sizing: border-box;
      top: calc(200% + #{.5*$line}); left: calc(50% - #{.5*$dosc});
      border: solid $ring transparent;
      width: $dosc; height: $dosc;
      @extend %osc;
      box-shadow: 0 0 0 $line #fff;
      background: inherit;
      filter: drop-shadow(1px 3px 2px rgba(#000, .32))
    }

    &:after {
      width: $wbar;
      top: calc(100% - #{$rad0}); left: calc(50% - #{$rad0});
      border: solid 0 transparent;
      border-width: $rad0 $rad0 - .5*$wbar;
      padding-top: 100%;
      background:
              linear-gradient(#fff, #fff) padding-box,
              radial-gradient(circle at 50% $rad0,
                      #fff calc(#{$rad0} - 1px), rgba(#fff, 0) $rad0) border-box,
              radial-gradient(circle at 50% calc(100% - #{$rad0}),
                      #fff calc(#{$rad1} - 1px), rgba(#fff, 0) $rad1) border-box;
    }
  }
</style>