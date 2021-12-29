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

    socket.on('room', (msg, done) => {

        console.log(msg)

        setTimeout(()=>{
            done("Task is Done")
        }, 3000)


    })

    socket.on('disconnect', () => {
        console.log('SOCKET DISCONNECTED');
      });

})



httpServer.listen(3000, handleListen); 