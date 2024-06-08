import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, List, ListItem, ListItemText } from '@mui/material';

function UserList() {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchFollowing();
        fetchCurrentUser();
    }, []);

    // Fetch all users except the logged-in user
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users', {
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
            const response = await axios.get('http://localhost:5000/me/following', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setFollowing(response.data.following);
        } catch (error) {
            console.error('Error fetching following list:', error);
        }
    };

    // Fetch the current authenticated user details
    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/me', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCurrentUserId(response.data._id); // Assuming response contains user object with _id
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    // Follow a user
    const followUser = async (userId) => {
        try {
            await axios.post(`http://localhost:5000/follow/${userId}`, {}, {
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
            await axios.post(`http://localhost:5000/unfollow/${userId}`, {}, {
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

export default UserList;
