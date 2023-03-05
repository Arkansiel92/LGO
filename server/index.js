const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');

app.use(cors());

const server = http.createServer({
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
}, app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        method: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    let hub = io.sockets.adapter.rooms.get(socket.room);

    console.log(`CONNECTION : ${socket.id}`);

    function navigate(id) {
        return io.to(socket.id).emit('navigate', id);
    }

    socket.on('join', ({ id, pseudo }) => {
        hub = io.sockets.adapter.rooms.get(id);

        if (!hub) {
            return socket.emit('alert', 'Ce lobby n\'existe pas !');
        }

        if (hub.size < hub.nbPlayers) {
            hub.players.push(pseudo);
            hub.votes.push('');
            socket.room = id;
            socket.name = pseudo;
            socket.join(id);
            return navigate(id);
        } else {
            return socket.emit('alert', `La salle est complète !`);
        }
    })

    socket.on('setRoom', ({ id, players, pseudo }) => {
        socket.room = id;
        socket.name = pseudo
        socket.join(id);

        hub = io.sockets.adapter.rooms.get(id);

        hub.status = 'private';
        hub.author = socket.id;
        hub.nbPlayers = players;
        hub.players = [socket.name];
        hub.votes = [''];

        return navigate(id);
    })

    socket.on('clear', () => {
        let rooms = [...socket.rooms];

        
        rooms.forEach((room) => {
            if (room !== socket.id) {
                socket.leave(room);
                console.log(`Clear de la room : ${room} du socket : ${socket.id}`)
            }
        })
        
        rooms.filter(room => room.length === 0);
    })

    socket.on('disconnect', () => {
        console.log(`DISCONNECT : ${socket.id}`);
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});