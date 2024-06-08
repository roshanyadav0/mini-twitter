import React, { useState } from 'react';
import NavBar from './NavBar';
import { Button } from '@mui/material';
import MyTweets from './MyTweets';
import TweetCard from './TweetCard';

function Post() {
    const [view, setView] = useState('tweets'); // State to manage which view is displayed

    // Handler to switch to viewing tweets from users you follow
    const handleViewTweets = () => {
        setView('tweets');
    };

    // Handler to switch to viewing your tweets
    const handleViewMyTweets = () => {
        setView('myTweets');
    };

    return (
        <div>
            <NavBar/>
            <div className='post-div'>
                <div className='left-container'>
                    <Button onClick={handleViewTweets}>Tweets</Button>
                    <Button onClick={handleViewMyTweets}>My Tweets</Button>
                </div>
                <div className='right-container'>
                    {view === 'tweets' ? (
                        // Fetch and display tweets from users you follow
                        <div>
                            {/* Assuming you have a function to fetch these tweets */}
                            <h2>Latest Tweets from Users You Follow</h2>
                            <TweetCard />
                        </div>
                    ) : (
                        // Display your tweets or the form to post a new tweet
                        <MyTweets />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Post;
