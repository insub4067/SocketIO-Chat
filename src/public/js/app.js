// 실행 중인 소켓 서버 랑 연결
const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('input');
    const value = input.value
    socket.emit('message', input.value, roomName, () => {
        addMessage(`You : ${value}`);
    })
    input.value = ""


}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3')
    h3.innerText = `Room : ${roomName}`;
    const form = room.querySelector('form')
    form.addEventListener("submit", handleMessageSubmit)
} 

function addMessage(message){
    const ul = room.querySelector('ul');
    const li = document.createElement("li");
    li.innerText = message
    ul.appendChild(li)
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("room",roomName=input.value, showRoom,);
    roomName = input.value;
    input.value = "";
}

socket.on("welcome", ()=>{
    addMessage("someone joined")
})

socket.on("bye", ()=>{
    addMessage("someone left")
})

socket.on('message', addMessage)

form.addEventListener('submit', handleRoomSubmit);