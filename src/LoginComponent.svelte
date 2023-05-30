<script lang="ts">
    import {Router, Route, Link, useNavigate} from "svelte-navigator";
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';
    import { onMount } from "svelte";
    import { data, uid } from "./store.ts";
    import { slide } from 'svelte/transition';
    import RouteTransition from "./RouteTransition.svelte";

    const navigate = useNavigate();

    const googleAuth = () => {
        // console.log("Hey there"); // Route into BookCover.svelte after logging in
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(async (result) => {
            const user = result.user;
            if (user != null) {
                console.log(user.displayName);
                const db = firebase.firestore();
                let userDocRef = db.collection("users").doc(user.uid);
                let data_object = {};
                await userDocRef.get().then((doc) => {
                    if (doc.exists) {
                        // console.log("Document Data:", doc.data());
                        data_object = doc.data();
                    } else {
                        // console.log("New User or Missing Data!");
                        data_object = {
                            name: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            uid: user.uid,
                            cafeTable: [],
                            drinkTable: [],
                            public: true
                        };
                        db.collection("users").doc(user.uid).set(data_object)
                        userDocRef = db.collection("users").doc(user.uid);
                    }
                })
                data.set(data_object);
                uid.set(user.uid);
                navigate("/book", {});
            }
        })
            .catch((error) => {
                console.log(error);
            })
        // console.log("oauth");
    }

    const load_global_view = async () => {
        let raw_data = {};
        const db = firebase.firestore();
        await db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((user) => {
                let user_data = user.data();
                user_data.cafeTable.forEach((cafe) => {
                    if (raw_data[cafe.name] == undefined) {
                        console.log(cafe.name);
                        raw_data[cafe.name] = {
                            name: cafe.name,
                            ratings: [cafe.rating],
                            prices: [],
                            avg_rating: -1,
                            avg_price: -1,
                            recommendations: [cafe.recommend],
                            recommendation_ratio: -1,
                            num_drinks: cafe.drinks.length,
                            drinks: [],
                        }
                        let price_sum = 0;
                        cafe.drinks.forEach((drink) => {
                            raw_data[cafe.name].drinks.push({name: drink.name, data: [drink], users: [user_data.name]})
                            price_sum += drink.price;
                        });
                        raw_data[cafe.name].prices.push(price_sum);
                    } else {
                        raw_data[cafe.name].ratings.push(cafe.rating);
                        let price_sum = 0;
                        cafe.drinks.forEach((drink) => {
                            let i;
                            for (i = 0; i < raw_data[cafe.name].drinks.length; i++) {
                                if (raw_data[cafe.name].drinks[i].name == drink.name) {
                                    raw_data[cafe.name].drinks[i].data.push(drink);
                                    raw_data[cafe.name].drinks[i].users.push(user_data.name);
                                    break;
                                }
                            }
                            if (i == raw_data[cafe.name].drinks.length) {
                                raw_data[cafe.name].drinks.push({name: drink.name, data: [drink], users: [user_data.name]})
                            }
                            price_sum += drink.price;
                        });
                        raw_data[cafe.name].prices.push(price_sum);
                        raw_data[cafe.name].recommendations.push(cafe.recommend);
                        raw_data[cafe.name].num_drinks += cafe.drinks.length;
                    }
                })
            })
        })
        navigate("/query", {state: {type: "Cafe", level: "Global", data: raw_data}});
    }
</script>

<RouteTransition>
<main>
    <div id="title">
        <h1 style="font-size: 800%;" class="login-title"> Coffee Book </h1>
        <div id="button">
        <button on:click={googleAuth} class="login-title-btn login-btn"> <img src="https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_1280.png" alt="Google Icon" width="20" height="20"> Signin with Google </button>
        <button on:click={load_global_view} class="login-title-btn login-btn" style="background-color: cornflowerblue"> <img src="https://img.icons8.com/cotton/64/globe--v1.png" alt="Globe Icon" width="20" height="20"> Global View </button>
        </div>
    </div>
</main>
</RouteTransition>
<style>
    main {
        background-image: url("https://unsplash.com/photos/z_DkoUqgx6M/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTh8fGJvb2tzaGVsZnxlbnwwfHx8fDE2ODQ2Nzc0MDR8Mg&force=true");
        background-size: cover;
        background-repeat: no-repeat;

    /*    Fill Page*/
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #title {
        /*width: 17%;*/
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 20vh;
    }

    #button {
        justify-content: center;
        align-items: center;
        padding-top: 36vh;
    }

    .login-title {
        margin-top: 0px;
        padding-top: 0px;
        padding-right: 7px;
        font-size: 30px;
        font-weight: 700;
        margin-bottom: 20px;
        color: #ffffff;
    }

    .login-title-btn {
        /*display: inline-block;*/
        background-color: #333333;
        color: #ffffff;
        border: 2px solid #333333;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 14px;
        /*text-decoration: none;*/
        /*box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.3);*/
        transition: background-color 0.3s ease;
        cursor: pointer;
    }

    .login-btn:hover {
        background-color: #453333;
    }

    .login-btn img {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
    }
</style>