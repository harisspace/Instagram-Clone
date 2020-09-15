import React, { useState, useEffect} from 'react';
import './App.css';
import instagramLogo from './instagram-clone.png';
import Post from './components/Post';
import { db, auth } from './config/config';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUploud from './components/ImageUploud';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubsribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user has logged in
        setUser(authUser);
      } else {
        // user has logged out..
        setUser(null)
      }
    })

    return () => {
      unsubsribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])
    
  const signUp = (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then(authUser => authUser.user.updateProfile({
        displayName: username
      }))
      .catch(error => alert(error.message))

      setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))

    setOpenSignIn(false);
  }

  return (
  <div className="app">
  
    <Modal
      open={open}
      onClose={() => setOpen(false)}>
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <img className="app__signupImage" src={instagramLogo} alt="instagram logo"/>
        <Input 
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        <Input 
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        <Input 
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
        
      </div>
    </Modal>

    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}>
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <img className="app__signupImage" src={instagramLogo} alt="instagram logo"/>
        <Input 
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        <Input 
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>
        
      </div>
    </Modal>

    

    <div className="app__header">
      <img src={instagramLogo} alt="" className="app__headerImage"/>

      {user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className="app__loginContainer">
              <Button type="submit" onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button type="submit" onClick={() => setOpen(true)}>Sign Up</Button>

            </div>
          )}
    </div>

    

    {
      posts.map(({id, post}) => (
        <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} key={id} postId={id} user={user}/>)
      )
    }

    {user?.displayName ? (
      <ImageUploud username={user.displayName} />
    ) : (
      <h3>Login to uploud</h3>
    )}
    
  </div>
  );
  }

export default App;
