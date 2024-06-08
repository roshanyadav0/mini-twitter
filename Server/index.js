const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken package
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Secret key for JWT (should be stored securely, e.g., in environment variables)
const JWT_SECRET = 'your_jwt_secret_key';

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/register-app', {
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        
        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully!', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error registering new user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username in MongoDB
        const user = await User.findOne({ username });

        // If user not found or password does not match, return error
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

