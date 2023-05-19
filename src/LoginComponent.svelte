<script lang="ts">
    import {Router, Route, Link, useNavigate} from "svelte-navigator";
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';
    import { onMount } from "svelte";
    import { data } from "./store.ts";

    const navigate = useNavigate();

    const googleAuth = () => {
        console.log("Hey there"); // Route into BookCover.svelte after logging in
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            const user = result.user;
            if (user != null) {
                console.log(user.displayName);
                const db = firebase.firestore();
                let userDocRef = db.collection("users").doc(user.uid);

                userDocRef.get().then((doc) => {
                    if (doc.exists) {
                        console.log("Document Data:", doc.data());
                    }
                    else {
                        console.log("New User or Missing Data!");
                        db.collection("users").doc(user.uid).set({
                            name: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            uid: user.uid,
                            cafeTable: [],
                            drinkTable: [],
                            public: true
                        })
                        userDocRef = db.collection("users").doc(user.uid);
                    }
                })

                userDocRef.get().then((doc) => {
                    // Write to store and route with data (or without if store) into BookCover
                    data.set(doc.data());
                    navigate("/book", {});
                })
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