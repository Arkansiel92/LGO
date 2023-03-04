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
    console.log(`CONNECTION : ${socket.id}`);
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});