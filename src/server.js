import express from "express";
import WebSocket from "ws";
import http from "http"; 

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listen on http://localhost:3000")
 
// 서버 만들고
const server = http.createServer(app);
// 서버 합치기
const wss = new WebSocket.Server({server});

const sockets = []

// 연결됐을 경우
wss.on("connection", (socket) => {

    sockets.push(socket)

    socket['nickname'] = 'Anonymous'

    // 연결 됐을때 출력
    console.log("CONNECTED TO BROWSER");

    // 연결 끊겼을 경우
    socket.on("close", ()=>{
        console.log("DISCONNECTED FROM BROWSER");
    });

    // 메시지가 왔을 경우
    socket.on("message", (msg) => {
        const message = JSON.parse(msg)
        switch (message.type){
            case "message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`))
                break
            case "nickname":
                socket['nickname'] = message.payload
                break
        }
    });

});

server.listen(3000, handleListen); 