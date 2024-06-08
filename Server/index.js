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
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // New field to store followed users
});

const User = mongoose.model('User', userSchema);


const TweetSchema = new mongoose.Schema({
    header: { // New field for tweet header
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Tweet = mongoose.model('Tweet', TweetSchema);

// Middleware to authenticate requests
function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Endpoint to register a user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully!', token });
    } catch (error) {
        res.status(500).json({ error: 'Error registering new user' });
    }
});

// Endpoint to log in a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to post a tweet
app.post('/posttweet', authenticate, async (req, res) => {
    try {
        const { header, content, imageUrl } = req.body; // Extract header from request body
        const userId = req.user.userId;

        const newTweet = new Tweet({
            header, // Save header
            content,
            imageUrl,
            user: userId,
        });

        await newTweet.save();
        res.status(201).json({ message: 'Tweet posted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error posting tweet' });
    }
});

// Endpoint to get all tweets
app.get('/tweets', authenticate, async (req, res) => {
    try {
        const tweets = await Tweet.find().populate('user', 'username');
        res.status(200).json(tweets);
    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ error: 'Error fetching tweets' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});



// Endpoint to follow a user
app.post('/follow/:id', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const followUserId = req.params.id;

        // Find the authenticated user and update their following list
        await User.findByIdAndUpdate(userId, { $addToSet: { following: followUserId } });

        res.status(200).json({ message: 'User followed successfully!' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Endpoint to unfollow a user
app.post('/unfollow/:id', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const unfollowUserId = req.params.id;

        // Find the authenticated user and update their following list
        await User.findByIdAndUpdate(userId, { $pull: { following: unfollowUserId } });

        res.status(200).json({ message: 'User unfollowed successfully!' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Endpoint to fetch all users
// Endpoint to fetch all users except the authenticated user
app.get('/users', authenticate, async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        // Fetch all users except the authenticated user
        const users = await User.find({ _id: { $ne: currentUserId } }, 'username');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Endpoint to fetch the authenticated user's following list
app.get('/me/following', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('following', 'username');

        res.status(200).json({ following: user.following });
    } catch (error) {
        console.error('Error fetching following list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Endpoint to get the list of users followed by the current user
app.get('/following', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the current user and populate the 'following' field to get the list of users they follow
        const user = await User.findById(userId).populate('following', 'username');

        res.status(200).json(user.following);
    } catch (error) {
        console.error('Error fetching following list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// Endpoint to delete a tweet
app.delete('/tweet/:id', authenticate, async (req, res) => {
    try {
        const tweetId = req.params.id;
        const userId = req.user.userId; // Get user ID from authenticated user

        console.log(tweetId);
        console.log(userId);

        // Find the tweet by ID and ensure it belongs to the authenticated user
        const tweet = await Tweet.findOneAndDelete({ _id: tweetId, user: userId });

        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found or not authorized to delete' });
        }

        res.status(200).json({ message: 'Tweet deleted successfully' });
    } catch (error) {
        console.error('Error deleting tweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Endpoint to update a tweet
app.put('/tweets/:id', authenticate, async (req, res) => {
    try {
        const tweetId = req.params.id;
        const { header, content } = req.body;
        const userId = req.user.userId; // Get user ID from authenticated user

        // Find the tweet by ID and ensure it belongs to the authenticated user
        const tweet = await Tweet.findOneAndUpdate(
            { _id: tweetId, user: userId },
            { header: header, content: content },
            { new: true } // Return the updated tweet
        );

        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found or not authorized to update' });
        }

        res.status(200).json({ message: 'Tweet updated successfully', tweet });
    } catch (error) {
        console.error('Error updating tweet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Endpoint to get tweets of the logged-in user
app.get('/mytweets', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from authenticated user

        // Fetch tweets for the logged-in user
        const tweets = await Tweet.find({ user: userId }).populate('user', 'username');

        res.status(200).json(tweets);
    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ error: 'Error fetching tweets' });
    }
});
