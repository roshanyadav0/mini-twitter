import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Basic validation (add your own validation logic)
        if (!username || !email || !password) {
            return;
        }

        try {
            // Send a POST request to the backend server
            const response = await axios.post('http://localhost:5000/register', {
            username,
            email,
            password,
            });

            navigate('/');
        } catch (error) {
            console.log(error)
        }
        };

return (
    <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
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
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit">Register</button>
            <button onClick={()=>navigate('/login')}>Login</button>
        </form>
    </div>
)
}

export default Register
