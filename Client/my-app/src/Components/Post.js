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

    console.log(userId);

    const setDataInOrder = (array) => {
        // Initialize an empty array to hold the filtered data
        let filteredArray = [];
    
        console.log('User ID from token:', userId);
        console.log('Original Tweets Array:', array);
    
        const followingSet = new Set(followingList);

        // Iterate over the input array
        for (let i = array.length - 1; i >= 0; i--) {
            const tweet = array[i];
            const tweetUserId = tweet.user ? tweet.user._id : null;

            console.log(`Processing tweet with userId: ${tweetUserId}`);

            // Check if tweet user ID is valid, doesn't match logged-in user,
            // AND the user ID is present in the following set
            if (tweetUserId && tweetUserId !== userId && followingSet.has(tweetUserId)) {
            filteredArray.push(tweet);
            console.log('Added to filtered array:', tweet);
            } else {
            console.log('Skipped tweet:', tweet);
            }
        }

        // Return the filtered array
        console.log('Filtered Array:', filteredArray);

        console.log(followingList);


        return filteredArray;
    };
    



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

    const fetchTweets = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/tweets', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            console.log('Tweets response:', response.data);
    
            // Use setDataInOrder to filter and order the tweets
            const orderedTweets = setDataInOrder(response.data);
    
            console.log('Filtered and Ordered Tweets:', orderedTweets);
    
            // Update the state with the filtered and ordered tweets
            setTweets(orderedTweets);
    
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
