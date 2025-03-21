const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = 5001;

// URL for the mock API
const MOCK_API_URL = 'http://localhost:5000/api/teams';

// Store the last known update time
let lastUpdateTime = null;

// Function to check for updates from the mock API server
function checkForUpdates() {
    setInterval(async () => {
        try {
            const response = await axios.get(MOCK_API_URL);
            if (response.status === 200) {
                const data = response.data;
                const currentUpdateTime = data.last_updated;

                // If this is a new update, emit it to clients
                if (currentUpdateTime !== lastUpdateTime) {
                    console.log(`New data detected, update time: ${currentUpdateTime}`);
                    lastUpdateTime = currentUpdateTime;
                    io.emit('data_update', data); // Broadcast the update to all connected clients
                }
            } else {
                console.error(`Error fetching data: ${response.status}`);
            }
        } catch (error) {
            console.error(`Exception during update check: ${error.message}`);
        }
    }, 5000); // Check every 5 seconds
}

// Handle client connections
io.on('connection', (socket) => {
    console.log('Client connected');

    // Get the latest data and send it immediately to the newly connected client
    axios.get(MOCK_API_URL)
        .then((response) => {
            if (response.status === 200) {
                socket.emit('data_update', response.data); // Send initial data to the client
            }
        })
        .catch((error) => {
            console.error(`Error fetching initial data: ${error.message}`);
        });

    // Handle client disconnections
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server and the update check
checkForUpdates();
server.listen(PORT, () => {
    console.log(`Socket.IO server running on http://localhost:${PORT}`);
});