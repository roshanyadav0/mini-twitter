import React, { useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const backendUrl = "https://mini-twitter-vaau.onrender.com";

function TweetCard({ tweet, onDelete, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [editedHeader, setEditedHeader] = useState(tweet.header);
    const [editedContent, setEditedContent] = useState(tweet.content);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditedHeader(tweet.header);
        setEditedContent(tweet.content);
    };

// Update handleSaveEdit function to include authentication token
const handleSaveEdit = async () => {
    try {
        const token = localStorage.getItem('token'); // Retrieve authentication token
        await axios.put(
            `${backendUrl}/tweets/${tweet._id}`,
            {
                header: editedHeader,
                content: editedContent
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the headers
                }
            }
        );
        onUpdate(tweet._id, editedHeader, editedContent);
        setEditing(false);
    } catch (error) {
        console.error('Error updating tweet:', error);
    }
};

// Update handleDelete function to include authentication token
const handleDelete = async () => {
    try {
        const token = localStorage.getItem('token'); // Retrieve authentication token
        await axios.delete(`${backendUrl}/tweet/${tweet._id}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the headers
            }
        });
        onDelete(tweet._id);
    } catch (error) {
        console.error('Error deleting tweet:', error);
    }
};


    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            {editing ? (
                <div>
                    <input
                        type="text"
                        value={editedHeader}
                        onChange={(e) => setEditedHeader(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={3}
                        style={{ width: '100%' }}
                    />
                    <div style={{ marginTop: '10px' }}>
                        <Button onClick={handleSaveEdit} variant="contained" color="primary">
                            Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="contained" color="secondary">
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <h3>{tweet.header}</h3>
                    <p>{tweet.content}</p>
                    {tweet.imageUrl && <img src={tweet.imageUrl} alt="Tweet" style={{ maxHeight: '200px' }} />}
                    <p><strong>Posted by:</strong> {tweet.user.username}</p>
                    <p><strong>Posted on:</strong> {new Date(tweet.createdAt).toLocaleString()}</p>
                    <div>
                        <Button onClick={handleEdit} variant="contained" color="primary">
                            Edit
                        </Button>
                        <Button onClick={handleDelete} variant="contained" color="secondary">
                            Delete
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TweetCard;
