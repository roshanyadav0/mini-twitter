import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, List, ListItem, ListItemText } from '@mui/material';


const backendUrl = "https://mini-twitter-vaau.onrender.com";

function UserList() {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [myId, setMyId] = useState(null); // State to store the logged-in user ID

    useEffect(() => {
        fetchUsers();
        fetchFollowing();
    }, []);

    // Decode JWT token to get user ID
const getUserIdFromToken = (token) => {
    try {
        const payload = token.split('.')[1]; // JWT payloads are Base64 encoded
        const decodedPayload = atob(payload); // Decode Base64
        const { userId } = JSON.parse(decodedPayload); // Parse JSON
        return userId;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};

// Usage
const token = localStorage.getItem('token');
const userId = getUserIdFromToken(token);

    // Fetch all users except the logged-in user
    const fetchUsers = async () => {
        try {
            console.log('Logged-in User ID:', userId);
    
            const response = await axios.get(`${backendUrl}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            // Filter out the logged-in user from the list of users
            const filteredUsers = response.data.filter(user => user._id !== userId);
    
            console.log('Filtered Users:', filteredUsers);
    
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    

    // Fetch the authenticated user's following list
    const fetchFollowing = async () => {
        try {
            const response = await axios.get(`${backendUrl}/me/following`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setFollowing(response.data.following);
            console.log(followUser);
        } catch (error) {
            console.error('Error fetching following list:', error);
        }
    };

    useEffect(() => {
        setMyId(localStorage.getItem('userId')); // Set the logged-in user ID when component mounts
    }, []);

    // Follow a user
    const followUser = async (userId) => {
        try {
            await axios.post(`${backendUrl}/follow/${userId}`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            fetchFollowing(); // Update the following list
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    // Unfollow a user
    const unfollowUser = async (userId) => {
        try {
            await axios.post(`${backendUrl}/unfollow/${userId}`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            fetchFollowing(); // Update the following list
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    return (
        <div>
            <h2>Users</h2>
            <List>
                {users.map(user => (
                    // Check if the user ID is the same as the logged-in user ID
                    (user._id === myId) ? null : (
                        <ListItem key={user._id}>
                            <ListItemText primary={user.username} />
                            {following.some(followedUser => followedUser._id === user._id) ? (
                                <Button variant="contained" color="secondary" onClick={() => unfollowUser(user._id)}>Unfollow</Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={() => followUser(user._id)}>Follow</Button>
                            )}
                        </ListItem>
                    )
                ))}
            </List>
        </div>
    );
}

export default UserList;
