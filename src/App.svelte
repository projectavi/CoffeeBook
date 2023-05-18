<script lang="ts">
<!--    This is the login page and script -->
import { Router } from 'svelte-router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/app';
import 'firebase/compat/firestore';

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
                        })
                        userDocRef = db.collection("users").doc(user.uid);
                    }
                    // Write to store and route with data (or without if store) into BookCover
                })
            }
        })
            .catch((error) => {
                console.log(error);
            })
        console.log("oauth");
    }
</script>

<body>
<h3> Login to your Coffee Book </h3>
<button onclick={googleAuth}> Login/Signup with Google </button>
</body>