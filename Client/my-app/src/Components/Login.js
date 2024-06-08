import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();

        // Basic validation (add your own validation logic)
        if (!username || !password) {
        setErrorMessage('Both fields are required');
        return;
        }

        // Handle login logic (e.g., send data to the server)
        console.log('Logging in with:', { username, password });

        // Clear form after submission
        setUsername('');
        setPassword('');
        setErrorMessage('');
    };
return (
    <div>
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
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit">Login</button>
            <button onClick={()=>navigate('/register')}>Register</button>
        </form>
    </div>
)
}

export default Login
