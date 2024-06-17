const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const path = require("path");
const { Stats } = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/Public'));

// Socket.IO automatically serves the client library from /socket.io/socket.io.js
app.get("/", (req, res) => {
    console.log("req received")
    res.sendFile(path.join(__dirname, "Pages", "home.html"))
})
app.get("/chat", (req, res) => {
    console.log("req received")
    res.sendFile(path.join(__dirname, "Pages", "chatting.html"))
})
// these two should be initialised outside because if initialized inside on connection event, it will reinitialised everytime a new user connects
let waitingSocketID = ""

io.on('connection', (socket) => {
    console.log('connected')
    // if someone is waiting to chat
    if (waitingSocketID) {
        // we share the socket id of users with each other
        io.to(socket.id).emit("Your Companion Is", { myID: socket.id, CompanionID: waitingSocketID, status: 2001 })
        io.to(waitingSocketID).emit("Your Companion Is", { myID: waitingSocketID, CompanionID: socket.id, status: 2001 })
        waitingSocketID = ""

    }
    else {
        // if noone is waiting, make you wait xD
        waitingSocketID = socket.id
        io.to(waitingSocketID).emit("Your Companion Is", "No companion found for you, please wait until someone joins the chat")
    }

    socket.on("private message", (data) => {
        io.to(data.destSocket).emit("private message", data.message)
    })







    // console.log('A new user is Connected to the world chat with socket id: ', socket.id);

    // socket.on('message', (msg) => {
    //     console.log('message: ' + msg);
    //     io.emit('message', msg);
    // });

    // if (waitingSocketID) {
    //     console.log("Looks like someone was waiting for you ")
    //     io.emit("private message", `You are connected to the user with socket id ${waitingSocketID}`)
    //     io.emit("User 2 Socket ID", waitingSocketID)
    // }
    // else {
    //     console.log("No user was Found So you are a waiting user")
    //     waitingSocketID = socket.id
    //     waitingUsers.push(waitingSocketID)
    //     console.log("waiting ids are ", waitingUsers)
    // }

    // // lets handle the private messages between two users connected
    // let user1=socket.id
    // let user2=waitingSocketID

    // socket.on("private text to user 2",(message)=>{

    // })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // send a message to disconnect sockets
        io.emit("Find Someone New", { message: "Find Someone New", status: 2002 })
        waitingSocketID = ""
    });


    socket.on("reset sockets", () => {
        io.emit("reset socket")
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
