import {Socket} from 'socket.io';
import { Player } from './player.js';
import { Room } from './room.js';
import { user } from './interface.js';
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

const rooms: {[roomId: string]: Room} = {}

io.on('connection', (socket: Socket) => {
    const player = new Player(socket);
    let room: Room;

    socket.on('create-room', (user: user) => {
        room = new Room();
        room.setPlayer(player);

        player.socket.join(room.getId());
        player.setUser(user);        
        player.setRoom(room.getId());

        rooms[room.getId()] = room;

        socket.emit('join-room', "/game/" + room.getId())
    })

    socket.on('join-room', (id: string, user: user) => {
        if (!rooms[id]) return;
        
        const room = rooms[id];

        room.setPlayer(player);

        player.socket.join(room.getId());
        player.setUser(user);        
        player.setRoom(room.getId());
    })

    socket.on('get-room', () => {
        let roomId = player.getRoom();
        
        if (roomId) {
            let room = rooms[roomId];
            socket.emit('get-room', room.getRoom());
        }
    })

    socket.on('inputs', inputs => {
        player.setInputs(inputs);

        if(room) {
            io.to(player.getRoom()).emit('get-room', room.getRoom());
        }
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});