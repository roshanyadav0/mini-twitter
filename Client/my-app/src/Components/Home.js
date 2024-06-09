import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import '../Css/Home.css'


function Home() {
return (
    <div>
        <NavBar/>
        <div className='main-div-content'>
            <h1>This is Mini Twitter Site</h1>
            <p>Mini Twitter Clone (MERN Stack)
                You have been assigned to develop a mini-Twitter clone using the MERN Stack (MongoDB,
                Express.js, React.js, Node.js).
                The application should allow users to register, post tweets, follow other users, and view the
                tweets of the users they have followed.
            </p>
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
            <h4>Brownie Tasks (optional):</h4>
            <ul>
                <li>Deploy both the frontend and backend application</li>
                <li>Add image/video upload functionality for image/video in tweets.</li>
                <li>atlas.mongodb.com to host a free mongo database</li>
                <li>cloudinary to upload and server media</li>
            </ul>
        </div>
        <Footer/>
    </div>
)
}

export default Home