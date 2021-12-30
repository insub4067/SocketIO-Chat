import express from "express";
import SocketIO from "socket.io";
import http from "http"; 
import crypto from "crypto";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listen on http://localhost:3000")
 


// 서버 만들고
const httpServer = http.createServer(app);
// 소켓 서버랑 합치기 
const wsServer = SocketIO(httpServer);

function publicRooms(){
    const {sockets : {adapter : {sids, rooms} } } = wsServer
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key)
        }
    })
    return publicRooms
}

function countMembers(roomNumber){
    return wsServer.sockets.adapter.rooms.get(roomNumber)?.size
}

// 소켓 서버랑 연결시
wsServer.on('connection', (socket) => {
    socket['nickname'] = "user-" + crypto.randomBytes(3).toString("hex");

    // 모든 신호
    socket.onAny((event)=>{
        console.log(event)
    })

    // 환영
    socket.emit("greeting", `Welcome! ${socket.nickname}`)
    socket.emit("currentRooms", publicRooms())

    // 방 만들기 or 참가
    socket.on('enterRoom', (roomName, done) => {
        socket.join(roomName)
        done(roomName);
        socket.to(roomName).emit("joined", socket.nickname, roomName, countMembers(roomName))
        socket.emit("joined", socket.nickname, roomName, countMembers(roomName))
        wsServer.sockets.emit("currentRooms", publicRooms())
        socket.to(roomName).emit("count",roomName, countMembers(roomName))
        socket.emit("count", countMembers(roomName))
    })

    // 메시지
    socket.on('message', (message, roomName, done) => {
        socket.to(roomName).emit('message', `${socket.nickname} : ${message}`)
        done();
    })

    // 연결 끊김
    socket.on('disconnect', () => {
        wsServer.sockets.emit("currentRooms", publicRooms() )
     });

    // 퇴장
    socket.on("disconnecting", () => {
        socket.rooms.forEach( (room) => {
            socket.to(room).emit("bye", socket.nickname, room, countMembers(room) - 1)
        })
    })

    // 닉네임
    socket.on('nickname', (nickname)=>{
        socket['nickname'] = nickname
        socket.emit("greeting", `Welcome! ${socket.nickname}`)
    })

})



httpServer.listen(3000, handleListen); 