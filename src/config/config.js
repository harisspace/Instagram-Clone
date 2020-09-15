import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC6OaM-HOtKANl8QFL8jcFLm_XkgUPQFZk",
    authDomain: "instagram-clone-a127e.firebaseapp.com",
    databaseURL: "https://instagram-clone-a127e.firebaseio.com",
    projectId: "instagram-clone-a127e",
    storageBucket: "instagram-clone-a127e.appspot.com",
    messagingSenderId: "404560091017",
    appId: "1:404560091017:web:64f3fb6274c5ea6c8f3358",
    measurementId: "G-Y3KTH4SZ99"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };