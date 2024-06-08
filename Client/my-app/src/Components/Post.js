import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { Button } from '@mui/material';
import MyTweets from './MyTweets';
import TweetCard from './TweetCard';
import FollowingList from './FollowingList';
import axios from 'axios';

function Post() {
    const [view, setView] = useState('tweets');
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followingList, setFollowingList] = useState([]);

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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTweets(response.data.filter(tweet => followingList.includes(tweet.user._id))); // Filter tweets based on following list
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
            setFollowingList(response.data.map(user => user._id)); // Store only user IDs in the following list
        } catch (error) {
            console.error('Error fetching following list:', error);
        }
    };

    useEffect(() => {
        if (view === 'tweets') {
            fetchFollowingList(); // Fetch following list when the component mounts
            fetchTweets();
        }
    }, []);

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
                                tweets.length > 0 ? (
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
