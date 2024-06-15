const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const path = require("path")

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/Public'));

// Socket.IO automatically serves the client library from /socket.io/socket.io.js
app.get("/home", (req, res) => {
    console.log("req received")
    res.sendFile(path.join(__dirname, "Pages", "home.html"))
})
app.get("/chat", (req, res) => {
    console.log("req received")
    res.sendFile(path.join(__dirname, "Pages", "chatting.html"))
})

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
