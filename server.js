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


// logic to handle socket things
io.on("connection", (socket) => {
    let connectedUserId = []
    connectedUserId.push(socket.id)

    console.log("finally an user is connected")
    // 

    socket.on('join', (userId) => {
        let myID = userId
        let mySocketIndex = connectedUserId.indexOf(myID)
        let indexOfCompanion = Math.floor(Math.random() * connectedUserId.length)
        while (indexOfCompanion == mySocketIndex) {
            indexOfCompanion = Math.floor(Math.random() * connectedUserId.length)
        }
        let myCompanion = connectedUserId[index]
        io.to(myID).emit("Notification", "A user found for you")
        io.to(myCompanion).emit("Notification", "A user found for you")
    })

    socket.on("private message", (message))
})

app.listen(PORT, () => {
    console.log(`server is live on http://localhost:${PORT}`)
})