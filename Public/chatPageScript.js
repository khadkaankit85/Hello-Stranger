const socket = io()
const mainChat = document.getElementById("Main-chat-Body")
const formOfinput = document.getElementById("chat-typing-section")
const messageInput = document.getElementById("chat-typing-section-input")

formOfinput.addEventListener("submit", (e) => {
    e.preventDefault()
    let message = messageInput.value
    socket.emit("private message", message)
    console.log("emitted ", message)
    message = ""
})

// let's handle some common connection errors
socket.on('error', (socket) => {
    setTimeout(() => {
        socket.connect()
        // retry to establish the connection after 7 secs
    }, 7000)
})



const bodyOfTheChattingPage = document.getElementById("main-chatting-body")