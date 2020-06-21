import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/storage'
import '@firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyA33sBvwYzBign6lsuZbLpKE4tQ_zDwt8I",
  authDomain: "slack-clone-c386a.firebaseapp.com",
  databaseURL: "https://slack-clone-c386a.firebaseio.com",
  projectId: "slack-clone-c386a",
  storageBucket: "slack-clone-c386a.appspot.com",
  messagingSenderId: "903819125813",
  appId: "1:903819125813:web:cd3aa8d572cc5145a37d7c",
  measurementId: "G-P56N74PZ85"
}

firebase.initializeApp(firebaseConfig)

export default firebase
