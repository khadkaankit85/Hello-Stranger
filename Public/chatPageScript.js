const socket = io()
// let's handle some common connection errors
socket.on('error', (socket) => {
    setTimeout(() => {
        socket.connect()
        // retry to establish the connection after 7 secs
    }, 7000)
})

const bodyOfTheChattingPage = document.getElementById("main-chatting-body")