// function sentChatElement(message) {
//     // let element = document.createElement('div')
//     // console.log("returned sent chat")

//     // element.innerHTML = `<div class="sentChat">
//     //     <p class="sentChatInnerText">
//     //         ${message}
//     //     </p>
//     // </div>`
//     // return element

//     let divElement = document.createElement("div")
//     divElement.className = "sentChat"

//     let messageParagraph = document.createElement("p")
//     messageParagraph.className = "sentChatInnerText"

//     messageParagraph.innerText = message
//     divElement.appendChild(messageParagraph)

//     return divElement
// }

// function receivedChatElement(message) {
//     // let element = document.createElement('div')
//     // console.log("returned sent chat")

//     // element.innerHTML = `<div class="receivedChat">
//     //                     <p class="receivedChatInnertext">
//     //                         ${message}
//     //                     </p>
//     //                 </div>`
//     // return element

//     // the code above has the risk of xss so better way to do it is
//     let divElement = document.createElement("div")
//     divElement.className = "receivedChat"

//     let messageParagraph = document.createElement("p")
//     messageParagraph.className = "receivedChatInnertext"


//     messageParagraph.addEventListener("click", (e) => {
//         console.log(e)
//     })

//     messageParagraph.innerText = message
//     divElement.appendChild(messageParagraph)

//     return divElement
// }


function createChatElement(message, className) {
    let divElement = document.createElement("div");
    divElement.className = className;

    let dateElement = document.createElement("div");
    dateElement.className = "chatDate";
    dateElement.style.display = "none"; // Initially hidden
    dateElement.innerText = new Date().toLocaleString(); // Format date as needed

    let messageParagraph = document.createElement("p");
    messageParagraph.className = className + "InnerText";
    messageParagraph.innerText = message;

    messageParagraph.addEventListener("click", () => {
        // Toggle date visibility
        dateElement.style.display = dateElement.style.display === "none" ? "block" : "none";
    });

    if (className == "sentChat") {

        divElement.appendChild(dateElement);
        divElement.appendChild(messageParagraph);
    }
    else {
        divElement.appendChild(messageParagraph);
        divElement.appendChild(dateElement);
    }

    return divElement;
}

function createAlert(message, type) {
    let divElement = document.createElement("div")
    divElement.className = "sentChat"

    let alertElement = document.createElement("div")
    alertElement.className = type

    alertElement.innerText = message

    divElement.appendChild(alertElement)
    bodyOfTheChattingPage.appendChild(divElement)


}

function sentChatElement(message) {
    return createChatElement(message, "sentChat");
}

function receivedChatElement(message) {
    return createChatElement(message, "receivedChat");
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



const socket = io({
    reconnection: true,          // Enable reconnections
    reconnectionAttempts: 5,     // Number of reconnection attempts before giving up
    reconnectionDelay: 1000,     // Delay between each reconnection attempt (1 second)
    reconnectionDelayMax: 5000,  // Maximum delay between reconnections (5 seconds)
    timeout: 20000               // Connection timeout before failing (20 seconds)
});

const mainChat = document.getElementById("Main-chat-Body")
const formOfinput = document.getElementById("chat-section-form")
const messageInput = document.getElementById("chat-typing-inputbox")
const bodyOfTheChattingPage = document.getElementById("chat-section-body")
const Loader = document.getElementById("loaderDiv")


const sendButton = document.getElementById("sendMessageButton")

function checkSendButton() {
    if (messageInput.value.trim("") == "" || !messageInput.value) {
        sendButton.innerText = "❤️"
    }
    else {
        sendButton.innerText = "⏩"
    }
}
messageInput.addEventListener('input', () => {
    checkSendButton()
})

const chatSectionToScroll = document.getElementById("chat-section-id")


document.getElementById("notLoader").style.display = "hidden"
// document.getElementById("loader").style.display = "block"

let destSocket = ""
let hasCompanion = false
// checkConnection()

socket.on("Your Companion Is", (message) => {
    if (message.status === 2001) {
        console.log("user 2 ", message.CompanionID)
        // if (message.status == 4001) {
        //     setTimeout(() => {
        //         socket.connect()
        //     }, 7000)
        // }
        destSocket = message.CompanionID
        hasCompanion = true
        createAlert(`Connected to the user with ID ${message.CompanionID}`, "alert")
        checkConnection()
    }
    else if (message.status = 4001) {
        console.log("We couldn't find anyone who wanna talk to you ")
        hasCompanion = false
        checkConnection()



    }
})

formOfinput.addEventListener("submit", (e) => {

    if (hasCompanion) {
        console.log("message sent")
        e.preventDefault()
        let message = messageInput.value
        if (message.trim("") == "") {
            message = "❤️"
        }


        {
            socket.emit("private message", { destSocket, message })

            // to create a new chat paragraph
            bodyOfTheChattingPage.appendChild(sentChatElement(message))


            // for scrolling behaviour
            chatSectionToScroll.scrollTo({
                left: 0,
                top: bodyOfTheChattingPage.scrollHeight,
                behavior: 'smooth'
            });

            messageInput.value = ""
            checkSendButton()

        }
    }

})

socket.on("private message", (message) => {
    // add new texts to the website rather than console

    // let newText = document.createElement("div")
    // newText.id = "TextReceived"
    // newText.textContent = message
    let date = new Date()
    let dateElement = document.createElement("div")
    dateElement.innerHTML = `<h1 style="text-align:center; color:white; display:none">
        ${date}
    </h1>`
    bodyOfTheChattingPage.appendChild(dateElement)

    bodyOfTheChattingPage.appendChild(receivedChatElement(message))
    // document..scrollTo(0, window.scrollY + 200);


    // for scrolling behaviour
    chatSectionToScroll.scrollTo({
        left: 0,
        top: bodyOfTheChattingPage.scrollHeight,
        behavior: 'smooth'
    });


    console.log("private message from the server: ", message)
})

socket.on("Your Companion Is", (message) => {
    console.log(message)
})


socket.on("Find Someone New", (message) => {
    destSocket = ""
    hasCompanion = false
    checkConnection()
    location.reload()
})




