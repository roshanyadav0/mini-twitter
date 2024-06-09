import React from 'react'
import NavBar from './NavBar'



function Home() {
return (
    <div>
        <NavBar/>
        <div>
            <h1>This is Mini Twitter Site</h1>
            <h4>In this site i had implimented</h4>
            <ol>
                <li>Implement a user registration and authentication system.</li>
                <li>Users should be able to register with a unique username and password.</li>
                <li>Users should be able to log in and log out.</li>
                <li>Implement authentication using JWT (JSON Web Tokens).</li>
                <li>Design and implement the database schema using MongoDB to store user data, tweets
and follower information.</li>
                <li>Create, edit, and delete tweets.</li>
                <li>Follow/Unfollow any user.</li>
                <li>View the timeline, which displays tweets from followed users in chronological order.</li>
            </ol>
        </div>
    </div>
)
}

export default Home