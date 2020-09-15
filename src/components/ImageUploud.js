import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage, db } from '../config/config';
import firebase from 'firebase';
import './ImageUploud.css';

function ImageUploud({username}) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUploud = () => {
        const uploudTask = storage.ref(`images/${image.name}`).put(image);

        uploudTask.on(
            "state_changed",
            (snapshot) => {
                // progress bar
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message)
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username
                        });

                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    })
            }
        )
    }

    return (
        <div className="imageuploud">
            <progress className="imageuploud__progress" value={progress} max="100" />
            <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange}/>
            <Button className="imageUploud__button" onClick={handleUploud}>Uploud</Button>
        </div>
    )
}

export default ImageUploud
