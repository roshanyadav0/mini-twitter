import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

function PostTweet() {
    const [tweetContent, setTweetContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleInputChange = (event) => {
        setTweetContent(event.target.value);
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

            // Make API request to post tweet
            await axios.post(
                'http://localhost:5000/posttweet',
                { content: tweetContent, imageUrl: imageUrl },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            // Clear input fields after posting tweet
            setTweetContent('');
            setImage(null);
            setImagePreview(''); // Clear image preview
            // Optionally, you can show a success message or update state to trigger a refresh of the tweet feed
        } catch (error) {
            console.error('Error posting tweet:', error);
            // Optionally, you can show an error message to the user
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
