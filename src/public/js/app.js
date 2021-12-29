const url = window.location.host;
const messageList = document.querySelector("ul");
const messsageForm = document.querySelector("#message");
const nicknameForm = document.querySelector("#nickname");
const socket = new WebSocket(`ws://${url}`);

// JS object => string and send to Backend
function makeMessage(type, payload){
    const msg = {type, payload}
    return JSON.stringify(msg)
}

// 연결 확인
socket.addEventListener('open', ()=>{
    console.log("CONNECTED TO SERVER");
});

// 연결이 끊어졌을 경우
socket.addEventListener('close', () => {
    console.log("DISCONNECTED FROM SERVER");
});

// 메시지가 왔을 경우
socket.addEventListener('message', (message) => {
    const li = document.createElement("li")
    li.innerText = message.data
    console.log(li)
    messageList.append(li)
})

function handleNicknameSubmit(event){
    event.preventDefault()
    const input = nicknameForm.querySelector('input')
    socket.send(makeMessage("nickname", input.value));    
    input.value=''
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = messsageForm.querySelector('input');
    socket.send(makeMessage("message", input.value));
    input.value=''
}

messsageForm.addEventListener("submit", handleMessageSubmit);
nicknameForm.addEventListener('submit', handleNicknameSubmit)