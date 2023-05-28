<script>
    import { useLocation } from 'svelte-navigator';

    const location = useLocation();

    let query = $location.state;
</script>

<main>
    <div id="title">
        <h1> {query.level} {query.type} Rankings </h1>
    </div>
    <body>

    </body>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;

        background-color: #03254E;
    }

    #title {
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

        background-color: #ffffff;
    }
</style>