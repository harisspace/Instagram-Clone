import React, { useState, useEffect } from 'react';
import './post.css';
import { db } from '../config/config';
import firebase from 'firebase';

function Post({ postId, username, user, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsSubscribe;
        if (postId) {
            unsSubscribe = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => doc.data()));
            })
        }

        return () => {
            unsSubscribe();
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return (
        <div className="post">
            <div className="post__header">
                <img className="post__avatar" src="https://image.similarpng.com/very-thumbnail/2020/07/Icon-avatar-frame-hashtag-live-in-Instagram-vector-PNG.png" alt="hariss.akbar"/>
                <h3>{username}</h3>
            </div>
            
            <img src={imageUrl} alt="react js" className="post__image"/>

            <p className="post__username">
                <strong>{username}</strong> {caption}
            </p>

            <div className="post__comments">
                {
                    comments.map(comment => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

            {user && (
                <form className="post__commentBox">
                    <input className="post__input" type="text" placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)}/>

                    <button className="post__button" disabled={!comment} type="submit" onClick={postComment} >Post</button>
                </form>
            )}

           
        </div>
    )
    
}

export default Post