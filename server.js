const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const path = require("path")
require("dotenv").config()

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3000

const io = new Server(server)

app.use(express.static(path.join("Public")))

app.get("/home", (req, res) => {
    console.log("req received")
    res.sendFile(path.join(__dirname, "Pages", "home.html"))
})
app.get("/chat", (req, res) => {
    console.log("req received")
    res.sendFile(path.join(__dirname, "Pages", "chatting.html"))
})


// to check if there is any waiting sockets 
let waitingSocket = null
io.on("connection", (socket) => {
    if (waitingSocket) {
        let user2 = waitingSocket.socket.id
        socket.on("private message", (message) => {
            console.log("private message to someone", message)
            io.to(user2).emit("private message", message)
        })
    }
    else {
        waitingSocket = socket
    }


})
app.listen(PORT, () => {
    console.log(`server is live on http://localhost:${PORT}`)
})