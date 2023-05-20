<script lang="ts">
    import {Router, Route, Link, useNavigate} from "svelte-navigator";
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';
    import { onMount } from "svelte";
    import { data, uid } from "./store.ts";

    const navigate = useNavigate();

    const googleAuth = () => {
        console.log("Hey there"); // Route into BookCover.svelte after logging in
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
                        console.log("Document Data:", doc.data());
                        data_object = doc.data();
                    } else {
                        console.log("New User or Missing Data!");
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
        console.log("oauth");
    }
</script>

<main>
    <h2> Login to your CoffeeBook </h2>
    <button on:click={googleAuth}> Signin with Google </button>
</main>