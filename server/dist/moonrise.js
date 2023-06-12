"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_js_1 = require("./player.js");
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    const player = new player_js_1.Player(socket, null, null);
    if (player) {
        console.info(socket);
    }
});
server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});
