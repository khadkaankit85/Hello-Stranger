function sentChatElement(message) {
    // let element = document.createElement('div')
    // console.log("returned sent chat")

    // element.innerHTML = `<div class="sentChat">
    //     <p class="sentChatInnerText">
    //         ${message}
    //     </p>
    // </div>`
    // return element
    let divElement = document.createElement("div")
    divElement.className = "sentChat"

    let messageParagraph = document.createElement("p")
    messageParagraph.className = "sentChatInnerText"

    messageParagraph.innerText = message
    divElement.appendChild(messageParagraph)

    return divElement
}

function receivedChatElement(message) {
    // let element = document.createElement('div')
    // console.log("returned sent chat")

    // element.innerHTML = `<div class="receivedChat">
    //                     <p class="receivedChatInnertext">
    //                         ${message}
    //                     </p>
    //                 </div>`
    // return element

    // the code above has the risk of xss so better way to do it is
    let divElement = document.createElement("div")
    divElement.className = "receivedChat"

    let messageParagraph = document.createElement("p")
    messageParagraph.className = "receivedChatInnertext"

    messageParagraph.innerText = message
    divElement.appendChild(messageParagraph)

    return divElement
}
function checkConnection() {
    // whenever called, updates the alert: connecting, connected, disconnected
    if (hasCompanion) {
        Loader.style.display = "none"
    }
    if (!hasCompanion) {
        Loader.style.display = "flex"
    }
}

const socket = io()
const mainChat = document.getElementById("Main-chat-Body")
const formOfinput = document.getElementById("chat-section-form")
const messageInput = document.getElementById("chat-typing-inputbox")
const bodyOfTheChattingPage = document.getElementById("chat-section-body")
const Loader = document.getElementById("loaderDiv")


document.getElementById("notLoader").style.display = "hidden"
// document.getElementById("loader").style.display = "block"

let destSocket = ""
let hasCompanion = false
// checkConnection()

socket.on("Your Companion Is", (message) => {
    if (message.status === 2001) {
        console.log("user 2 ", message.CompanionID)
        if (message.status == 4001) {
            setTimeout(() => {
                socket = io()
            }, 7000)
        }
        destSocket = message.CompanionID
        hasCompanion = true
        checkConnection()
    }
    else if (message.status = 4001) {
        console.log("We couldn't find anyone who wanna talk to you ")
        hasCompanion = false
        checkConnection()

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
        bodyOfTheChattingPage.appendChild(sentChatElement(message))

        messageInput.value = ""
    }
    else {
        console.log("No companion for you at the moment")
    }
})

socket.on("private message", (message) => {
    // add new texts to the website rather than console

    // let newText = document.createElement("div")
    // newText.id = "TextReceived"
    // newText.textContent = message
    bodyOfTheChattingPage.appendChild(receivedChatElement(message))
    console.log("private message from the server: ", message)
})

socket.on("Your Companion Is", (message) => {
    console.log(message)
})

socket.on("Find Someone New", (message) => {
    destSocket = ""
    hasCompanion = false
    checkConnection()
})




