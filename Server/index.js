const express = require('express')
const app = express();

// Define the port
const port = 5000;

// Define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});