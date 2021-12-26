const url = window.location.host;

const socket = new WebSocket(`ws://${url}`);

socket.addEventListener('open', ()=>{
    console.log("Connected to Server");
});

socket.addEventListener('message', (message)=>{
    console.log(message.data)
});

socket.addEventListener('close', () => {
    console.log("Connected from Server");
});