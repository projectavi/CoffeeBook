import App from './App.svelte';
import firebase from 'firebase/compat/app';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

const firebaseConfig = {
	apiKey: "AIzaSyCtytXChvkiWtlio29GJ8OTehyz8pI3o-s",
	authDomain: "coffeebook-2e69d.firebaseapp.com",
	projectId: "coffeebook-2e69d",
	storageBucket: "coffeebook-2e69d.appspot.com",
	messagingSenderId: "654043573805",
	appId: "1:654043573805:web:6d710f35b132d9f21fd2a4"
} // Placeholder until firebase app setup is done

firebase.initializeApp(firebaseConfig);

export default app;