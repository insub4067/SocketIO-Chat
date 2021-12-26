const url = window.location.host;

const socket = new WebSocket(`ws://${url}`);

socket.addEventListener('open', ()=>{
    console.log("CONNECTED TO SERVER");
});

socket.addEventListener('message', (message)=>{
    console.log("Message : ", message.data)
});

socket.addEventListener('close', () => {
    console.log("DISCONNECTED FROM SERVER");
});

setTimeout( () => {
    socket.send('message from browser');
}, 3000);