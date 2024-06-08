import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { Button } from '@mui/material';
import MyTweets from './MyTweets';
import TweetCard from './TweetCard';
import FollowingList from './FollowingList';
import axios from 'axios';

function Post() {
    const [view, setView] = useState('tweets');
    const [tweets, setTweets] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(false);
    const [followingList, setFollowingList] = useState([]);


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

    const handleViewTweets = () => {
        setView('tweets');
        fetchTweets();
    };

    const handleViewMyTweets = () => {
        setView('myTweets');
    };

    const handleViewFollowing = () => {
        setView('following');
    };

    // const fetchTweets = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.get('http://localhost:5000/tweets', {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             }
    //         });

    //         // Log the response data to inspect it
    //         console.log('Tweets response:', response.data);

    //         setTweets(response.data);

    //         console.log(userId);
    //         // Filter out the logged-in user from the list of users
    //         const filteredUsers = response.data.filter(user => user._id !== userId);
            
    //         console.log('Filtered Users:', filteredUsers);
    
    //         setTweets(filteredUsers);

    //     } catch (error) {
    //         console.error('Error fetching tweets:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchTweets = async () => {
            try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/tweets', {
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
        
            console.log('Tweets response:', response.data);
        
            const tweets = response.data; // Store the fetched data
        
            // Filter out the logged-in user (choose one option below):
        
            // Option 1: Keep the filtered data (display only filtered tweets):
            const filteredUsers = tweets.filter(user => user._id !== userId);
            setTweets(filteredUsers);
        
            // Option 2: Don't filter twice (use the original data):
            // No additional filtering needed, use the fetched tweets directly.
        
            console.log('Filtered Users (if applicable):', filteredUsers); // Optional
        
            } catch (error) {
            console.error('Error fetching tweets:', error);
            } finally {
            setLoading(false);
            }
        };
    

    const fetchFollowingList = async () => {
        try {
            const response = await axios.get('http://localhost:5000/following', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Log the following list response
            console.log('Following list response:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setFollowingList(response.data.map(user => user._id)); // Store only user IDs in the following list
            } else {
                console.error('Unexpected data format for following list:', response.data);
                setFollowingList([]); // Set to empty array in case of unexpected format
            }

        } catch (error) {
            console.error('Error fetching following list:', error);
        }
    };

    useEffect(() => {
        if (view === 'tweets') {
            fetchFollowingList(); // Fetch following list when the component mounts
            fetchTweets();
        }
    }, [view]); // Adding `view` to the dependency array to ensure it re-fetches when the view changes

    return (
        <div>
            <NavBar />
            <div className='post-div'>
                <div className='left-container'>
                    <Button onClick={handleViewTweets}>Tweets</Button>
                    <Button onClick={handleViewMyTweets}>My Tweets</Button>
                    <Button onClick={handleViewFollowing}>Following</Button>
                </div>
                <div className='right-container'>
                    {view === 'tweets' ? (
                        <div>
                            <h2>Latest Tweets from Users You Follow</h2>
                            {loading ? (
                                <p>Loading tweets...</p>
                            ) : (
                                tweets.length > 0 ? ( // Guard against undefined `tweets`
                                    tweets.map(tweet => (
                                        <TweetCard key={tweet._id} tweet={tweet} />
                                    ))
                                ) : (
                                    <p>No tweets available</p>
                                )
                            )}
                        </div>
                    ) : view === 'myTweets' ? (
                        <MyTweets />
                    ) : (
                        <FollowingList />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Post;
