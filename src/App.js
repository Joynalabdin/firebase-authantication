import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName,email,photoURL} = res.user;
      const signInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser)
    })
    .catch(err =>{
      console.log(err)
      console.log(err.message)
    })
  }
  const handleSignOut = () => {
    const signOutUser ={
      isSignedIn : false,
      name : '',
      email : '',
      photoURL : ''
    }
    setUser(signOutUser)
  }
  const handleSubmit = () => {

  }
  const handleBlur = (e) => {
    let isFormValid = true;
    if (e.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      
    }
    if (e.target.name === 'password') {
      const isPasswordValild = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value)
      isFormValid = isPasswordValild&&passwordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = {...user}
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }
  return (
    <div className="App">
      {
        user.isSignedIn  ?
        <button onClick={handleSignOut} >Sign Out</button>
        :
        <button onClick={handleSignIn} >Sign In</button>

      }
      {
        user.isSignedIn && 
        <div>
          <p> Welcome {user.name} </p>
          <p> Your email:{user.email} </p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our own Authentication</h1>
      <p> Your name: {user.name} </p>
      <p>Email:{user.email} </p>
      <p>Password:{user.password} </p>



      <form onSubmit={handleSubmit}>
      <input type="text" name="name" onBlur={handleBlur} placeholder="Your name" required/><br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Your email" required/><br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/><br/>
      <input type="submit" value="Submit"/>   
      </form>

    </div>
  );
}

export default App;
