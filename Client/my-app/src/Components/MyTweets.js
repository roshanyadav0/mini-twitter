import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostTweet from './PostTweet';
import TweetCard from './TweetCard';

function MyTweets() {
    const [myTweets, setMyTweets] = useState([]);
    const [showPostTweet, setShowPostTweet] = useState(false);

    useEffect(() => {
        fetchMyTweets();
    }, []);

    const fetchMyTweets = async () => {
        try {
            // Make API request to fetch tweets of the logged-in user
            const response = await axios.get(`http://localhost:5000/mytweets`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMyTweets(response.data); // Update state with fetched tweets
            console.log(myTweets);
        } catch (error) {
            console.error('Error fetching my tweets:', error);
        }
    };

    // Handler to toggle view
    const handlePostTweetToggle = () => {
        setShowPostTweet(!showPostTweet); // Toggle between views
    };

    // Handler to delete a tweet from the state
    const handleDeleteTweet = (tweetId) => {
        setMyTweets(myTweets.filter(tweet => tweet._id !== tweetId));
    };

    return (
        <div>
            <div>
                <Button onClick={() => setShowPostTweet(false)}>My Tweets</Button>
                <Button onClick={handlePostTweetToggle}>
                    {showPostTweet ? "View My Tweets" : "Post Tweet"}
                </Button>
            </div>
            <div>
                {showPostTweet ? (
                    <PostTweet />
                ) : (
                    <div>
                        <h2>My Tweets</h2>
                        {myTweets.length > 0 ? (
                            myTweets.map((tweet) => (
                                <TweetCard key={tweet._id} tweet={tweet} onDelete={handleDeleteTweet} />
                            ))
                        ) : (
                            <p>No tweets found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyTweets;
