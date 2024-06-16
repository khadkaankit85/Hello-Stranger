

const socket = io()

const mainChat = document.getElementById("Main-chat-Body")
const formOfinput = document.getElementById("chat-typing-section")
const messageInput = document.getElementById("chat-typing-section-input")
const bodyOfTheChattingPage = document.getElementById("Main-chat-Body")



let destSocket = ""
let hasCompanion = false

socket.on("Your Companion Is", (message) => {
    if (message.status === 2001) {
        console.log("user 2 ", message.CompanionID)
        if (message.status == 4001) {
            setTimeout(() => {
                socket.connect()
            }, 7000)
        }
        destSocket = message.CompanionID
        hasCompanion = true
    }
    else if (message.status = 4001) {
        console.log("We couldn't find anyone who wanna talk to you ")
        setTimeout(() => {
            socket.connect()
            console.log("retried to connect to the server")
        }, 4000)
    }

})

formOfinput.addEventListener("submit", (e) => {

    if (hasCompanion) {
        console.log("message sent")
        e.preventDefault()
        let message = messageInput.value
        socket.emit("private message", { destSocket, message })

        // to create a new chat paragraph
        let newText = document.createElement("div")
        newText.id = "TextSent"
        newText.textContent = message
        bodyOfTheChattingPage.appendChild(newText)


        message = ""
    }
    else {
        console.log("No companion for you at the moment")
    }
})

socket.on("private message", (message) => {
    // add new texts to the website rather than console
    let newText = document.createElement("div")
    newText.id = "TextReceived"
    newText.textContent = message
    bodyOfTheChattingPage.appendChild(newText)
    console.log("private message from the server: ", message)
})

socket.on("Your Companion Is", (message) => {
    console.log(message)
})

socket.on("Find Someone New", (message) => {
    destSocket = ""
    hasCompanion = false
})




