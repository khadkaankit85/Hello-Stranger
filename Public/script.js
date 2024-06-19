const buttonToAnonymousChat = document.getElementById("linkto-anonymous-chat-page")
const buttonToAnonymousVideoCall = document.getElementById("linkto-anonymous-video-page")

buttonToAnonymousVideoCall.addEventListener("click", () => {
    console.log("button clickec")
    alert("Coming Soon")
})
buttonToAnonymousChat.addEventListener("click", () => {
    window.location = "/chat"
})