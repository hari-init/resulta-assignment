const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

/**
 * Here the main aim is to fetch the live data from the external server (eg. like score board)
 * with that idea i create this backend(backend.js) for get the data from another
 * remote mock server(mock/mock.js).
 * 1.With that i hosted all the server files on Render and gets the reference API for mapping.
 * 2.Fetching and caching the data in local variable will do some caching.
 * 3.With websocket i am sending the data to frontend.
 */

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = 5001;
const POLL_INTERVAL = 5000;
const MOCK_API_URL = "https://mock-zu2m.onrender.com/api/teams"; //The hosted Mock API.

let lastUpdateTime = null;
let cachedData = null;

/**
 * Here Fetching happens, returns the data.
 */
async function fetchData() {
  try {
    const response = await axios.get(MOCK_API_URL);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`Failed to fetch data: ${response.status}`);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return null;
  }
}

/**
 * Here it checks for the last_updated value because that's the one updates with every 30 sec
 * from the mock API.
 * So this function checks and returns the data as per the condition.
 */
async function checkForUpdates() {
  const data = await fetchData();
  if (data && data.last_updated !== lastUpdateTime) {
    console.log(`New data detected, update time: ${data.last_updated}`);
    lastUpdateTime = data.last_updated;
    cachedData = data;
    io.emit("data_update", data);
  }
}

io.on("connection", (socket) => {
  console.log("Client connected");

  if (cachedData) {
    socket.emit("data_update", cachedData);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

/**
 * This one is responsible for triggering the socket with updated data
 * to the front end.
 */
setInterval(checkForUpdates, POLL_INTERVAL);

server.listen(PORT, () => {
  console.log(`SocketIO server running on http://localhost:${PORT}`);
});
