import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const backendUrl = "https://mini-twitter-vaau.onrender.com";

function PostTweet() {
    const [tweetContent, setTweetContent] = useState('');
    const [tweetHeader, setTweetHeader] = useState(''); // New state for tweet header
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === 'tweetContent') {
            setTweetContent(value);
        } else if (id === 'tweetHeader') { // Handle change for tweet header
            setTweetHeader(value);
        }
    };

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Show a preview of the image
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let imageUrl = '';
            if (image) {
                // Upload image to Cloudinary
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', 'your_cloudinary_upload_preset');
                const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dav5sgqts/image/upload', formData);
                imageUrl = cloudinaryResponse.data.secure_url;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            // Make API request to post tweet with Authorization header and header field
            await axios.post(
                `${backendUrl}/posttweet`,
                {
                    header: tweetHeader, // Include tweet header in the request body
                    content: tweetContent,
                    imageUrl,
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // Clear input fields after posting tweet
            setTweetContent('');
            setTweetHeader(''); // Clear header input
            setImage(null);
            setImagePreview('');
        } catch (error) {
            console.error('Error posting tweet:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*',
        maxFiles: 1
    });

    return (
        <div>
            <h2>Post a Tweet</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="tweetHeader" // New input for tweet header
                    label="Enter tweet header"
                    variant="outlined"
                    value={tweetHeader}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    id="tweetContent"
                    label="Enter your tweet"
                    variant="outlined"
                    value={tweetContent}
                    onChange={handleInputChange}
                    multiline
                    fullWidth
                    required
                />
                <div
                    {...getRootProps()}
                    style={{
                        border: '2px dashed #cccccc',
                        padding: '20px',
                        textAlign: 'center',
                        marginTop: '20px',
                        cursor: 'pointer'
                    }}
                >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', marginTop: '10px' }} />
                    ) : (
                        <p>Drag & drop an image here, or click to select one</p>
                    )}
                </div>
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                    Post
                </Button>
            </form>
        </div>
    );
}

export default PostTweet;
