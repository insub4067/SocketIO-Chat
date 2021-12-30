// 실행 중인 소켓 서버 랑 연결
const socket = io();

const nav = document.getElementById('nav')
const lobby = document.getElementById("lobby")
const enternForm = nav.querySelector("#enter");
const room = document.getElementById("room");
const msgForm = room.querySelector('#msg')
const nameForm = lobby.querySelector('#name')


room.hidden = true;

let roomName;

function enterRoom(roomName){
    socket.emit("enterRoom",roomName, showRoom);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = msgForm.querySelector('input');
    const value = input.value
    socket.emit('message', input.value, roomName, () => {
        addSelfMessage(`You : ${value}`);
    })
    input.value = ""
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = nameForm.querySelector('input');
    const value = input.value
    socket.emit('nickname', value);
    input.value = ""
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = enternForm.querySelector('input');
    socket.emit("enterRoom",roomName=input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

function showRoom(Room){
    lobby.hidden = true;
    room.hidden = false;
    const roomName = room.querySelector('#roomName')
    roomName.innerText = `Room : ${Room}`;
    nameForm.addEventListener("submit", handleNicknameSubmit)
    msgForm.addEventListener("submit", handleMessageSubmit)
} 

function addMessage(message){
    const div = room.querySelector('#msgList');
    const span = document.createElement("span");
    span.innerText = message
    span.className = "otherMessage"
    div.appendChild(span)
}

function addSelfMessage(message){
    const div = room.querySelector('#msgList');
    const span = document.createElement("span");
    span.innerText = message
    span.className = "selfMessage" 
    div.appendChild(span)
}



function greeting (message){
    const h3 = lobby.querySelector('h3');
    h3.innerText = message
}

//Count Update
socket.on("count", (count)=>{
    const participant = room.querySelector('#participant')
    participant.innerText = `Participant : ${count}`; 
})

// 참가
socket.on("joined", (user,)=>{
    const div = room.querySelector('#msgList');
    div.innerHTML = ""
    addMessage(`${user} joined`)
})

// 방 나감
socket.on("bye", (user, count)=>{
    addMessage(`${user} leaved`)
    const participant = room.querySelector('#participant')
    participant.innerText = `Participant : ${count}`;      

})

// 메시지
socket.on('message', addMessage)

// 환영
socket.on("greeting", (msg)=>{
    greeting(msg)
})

// 현재 방 현황
socket.on("currentRooms", (rooms)=>{
    const roomList = lobby.querySelector("ul")
    roomList.innerHTML = ""

    rooms.forEach( (room) => {
        const li = document.createElement('li')
        li.innerText = room
        li.id = room
        li.addEventListener('click', (event) => {
            enterRoom(event.target.id)
        },false);        
        roomList.appendChild(li)
    })
})

enternForm.addEventListener('submit', handleRoomSubmit);
nameForm.addEventListener('submit', handleNicknameSubmit);