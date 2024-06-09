import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../Css/Login.css'

const backendUrl = "https://mini-twitter-vaau.onrender.com";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Basic validation (add your own validation logic)
    
            const response = await axios.post(`${backendUrl}/login`, {
                username,
                password,
            });

    
            // If login is successful, store the token in local storage
            localStorage.setItem('token', response.data.token);
    
            //route to home
            navigate('/');
            navigate(0);

        } catch (error) {
            console.log(error);
        }
    };
return (
    <div className='main-div'>
        <h1>Mini Twitter</h1>
        <div className='login-div'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>
                <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit">Login</button>
                <button onClick={()=>navigate('/register')}>Register</button>
            </form>
        </div>
    </div>
)
}

export default Login
