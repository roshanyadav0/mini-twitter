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
            // Make API request to fetch your tweets
            const response = await axios.get('http://localhost:5000/tweets', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMyTweets(response.data); // Update state with fetched tweets
        } catch (error) {
            console.error('Error fetching my tweets:', error);
        }
    };

    // Handler to toggle view
    const handlePostTweetToggle = () => {
        setShowPostTweet(!showPostTweet); // Toggle between views
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
                                <TweetCard key={tweet._id} tweet={tweet} />
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
