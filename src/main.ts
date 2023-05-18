import App from './App.svelte';
import firebase from 'firebase/compat/app';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

const firebaseConfig = {
	apiKey: "AIzaSyBs0ikzjEXKgKNu42vXk1IA2mxc7_Et6r0",
	authDomain: "by-the-cover-4309a.firebaseapp.com",
	projectId: "by-the-cover-4309a",
	storageBucket: "by-the-cover-4309a.appspot.com",
	messagingSenderId: "140622140850",
	appId: "1:140622140850:web:7b59345229d855fc8b40ab",
	measurementId: "G-989QZFHY7D"
} // Placeholder until firebase app setup is done

firebase.initialiseApp(firebaseConfig);

export default app;