"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_js_1 = require("./player.js");
const room_js_1 = require("./room.js");
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
const rooms = {};
io.on('connection', (socket) => {
    const player = new player_js_1.Player(socket);
    let room;
    socket.on('create-room', (user) => {
        room = new room_js_1.Room();
        room.setPlayer(player);
        player.socket.join(room.getId());
        player.setUser(user);
        player.setRoom(room.getId());
        rooms[room.getId()] = room;
        socket.emit('join-room', "/game/" + room.getId());
    });
    socket.on('join-room', (id, user) => {
        if (!rooms[id])
            return;
        const room = rooms[id];
        room.setPlayer(player);
        player.socket.join(room.getId());
        player.setUser(user);
        player.setRoom(room.getId());
    });
    socket.on('get-room', () => {
        let roomId = player.getRoom();
        if (roomId) {
            let room = rooms[roomId];
            socket.emit('get-room', room.getRoom());
        }
    });
    socket.on('inputs', inputs => {
        player.setInputs(inputs);
        if (room) {
            socket.emit('get-room', room.getRoom());
        }
    });
});
server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});
