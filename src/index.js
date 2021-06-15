const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')

const userRouter = require('./routes/user')
const postsRouter = require('./routes/posts')
const commentRouter = require('./routes/comment')

require('./db/mongoose')
         
const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

const port = process.env.PORT || 9000

app.use(cors({ origin: '*'}));
app.use(express.json())
app.use(cors({ origin: '*'}));
app.use(userRouter)
app.use(postsRouter)
app.use(commentRouter)

io.on('connection', (socket) => { 
   
    socket.emit('connection', "Welcome");
    socket.broadcast.emit('messsage', 'A new use has joined')

    socket.on('sendMessage', (mssg) => {
        io.emit('message', mssg)
    });   

    socket.on('sendLocation', (location) => {
        io.emit('message', `https://google.com/maps?=${location.latitude},${location.longitude}`)
    });   

    socket.on('disconnect', () => {
        io.emit('messsage', 'a user has left')
    })
});


server.listen(port, () =>{
    console.log("connected!");
})