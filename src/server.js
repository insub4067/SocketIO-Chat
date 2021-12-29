import express from "express";
import SocketIO from "socket.io";
import http from "http"; 
import Server from "socket.io";
import { set } from "express/lib/application";


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


// 소켓 서버랑 연결시
wsServer.on('connection', (socket) => {
    console.log("SOCKET CONNECTED");

    socket.onAny( (event) => {
        console.log(`SOCKET EVENT : ${event}`);
    })

    socket.on('room', (roomName, done) => {
        socket.join(roomName)
        done();
        socket.to(roomName).emit("welcome")
    })

    socket.on('message', (message, roomName, done) => {
        socket.to(roomName).emit('message', message)
        done();
    })

    socket.on('disconnect', () => {
        console.log('SOCKET DISCONNECTED');
      });

    socket.on("disconnecting", () => {
        socket.rooms.forEach( (room) => {
            socket.to(room).emit("bye")
        })
    })

})



httpServer.listen(3000, handleListen); 