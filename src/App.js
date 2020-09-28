import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);



function App() {
  const [newUser,setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: ''
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


  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
      
    }
    if (e.target.name === 'password') {
      const isPasswordValild = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value)
      isFieldValid = isPasswordValild&&passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = {...user}
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }


  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        const newUserInfo = {...user}
        newUserInfo.error = "";
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch(error => {
        const newUserInfo = {...user}
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        
      });
      console.log('submit')
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        const newUserInfo = {...user}
        newUserInfo.error = "";
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('Sign in user info', res.user)
      })
      .catch(function(error) {
        const newUserInfo = {...user}
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    e.preventDefault();
  }
  

const updateUserName = (name)=>{
  var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name,
  photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(function() {
  console.log('User name updated successfully')
}).catch(function(error) {
  console.log(error)
});
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
      <input type="checkBox" name="newUser" onChange={()=>setNewUser(!newUser)} id=""/>
      <lable htmlFor="newUser" >New user sign up</lable>
      <form onSubmit={handleSubmit}>
      {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name" required/>}<br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Your email" required/><br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/><br/>
      <input type="submit" value= {newUser ? 'Sign in' : 'Sign up'} />   
      </form>
      <p style={{color: 'red'}} > {user.error} </p>
      {user.success && <p style={{color: 'green'}}>User {newUser ?'created': "logged in"} successfully</p>}
      
    </div>
  );
}

export default App;
