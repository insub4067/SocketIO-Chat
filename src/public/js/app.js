// 실행 중인 소켓 서버 랑 연결
const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form");

function taskDone(msg){
    console.log("Message from server : ", msg);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit("room",{payload: input.value}, taskDone,);
    input.value = "";
}

form.addEventListener('submit', handleRoomSubmit);