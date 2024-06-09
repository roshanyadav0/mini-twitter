import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, List, ListItem, ListItemText } from '@mui/material';

const backendUrl = "https://mini-twitter-vaau.onrender.com";

function FollowingList() {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchFollowing();
    }, []);

    // Fetch all users (for demonstration purposes; in a real app, this would be more refined)
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/users`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setUsers(response.data);
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
        } catch (error) {
            console.error('Error fetching following list:', error);
        }
    };

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
                    <ListItem key={user._id}>
                        <ListItemText primary={user.username} />
                        {following.some(followedUser => followedUser._id === user._id) ? (
                            <Button variant="contained" color="secondary" onClick={() => unfollowUser(user._id)}>Unfollow</Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => followUser(user._id)}>Follow</Button>
                        )}
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default FollowingList;
