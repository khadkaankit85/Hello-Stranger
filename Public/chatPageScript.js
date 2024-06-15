const socket = io()

const mainChat = document.getElementById("Main-chat-Body")
const formOfinput = document.getElementById("chat-typing-section")
const messageInput = document.getElementById("chat-typing-section-input")


formOfinput.addEventListener("submit", (e) => {
    console.log("form submitted")
    e.preventDefault()
    let message = messageInput.value
    socket.emit("private message", message)
    console.log("emitted ", message)
    message = ""
})





const bodyOfTheChattingPage = document.getElementById("main-chatting-body")