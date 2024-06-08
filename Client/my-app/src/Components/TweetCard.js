import React from 'react';

function TweetCard({ tweet }) {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{tweet.header}</h3> {/* Display the tweet header */}
            <p>{tweet.content}</p>
            {tweet.imageUrl && <img src={tweet.imageUrl} alt="Tweet" style={{ maxHeight: '200px' }} />}
            <p><strong>Posted by:</strong> {tweet.user.username}</p>
            <p><strong>Posted on:</strong> {new Date(tweet.createdAt).toLocaleString()}</p>
        </div>
    );
}

export default TweetCard;
