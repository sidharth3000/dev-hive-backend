const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

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

    // socket.on('join', ({user, room}) => {
    //     socket.join(room)
    // })

    socket.on('sendMessage', (mssg, d, user,  callback) => {
        const filter = new Filter()

        if(filter.isProfane(mssg)){
            return callback('Profanity is not allowed')
        }

        io.emit('message', mssg, d, user)
        callback();
    });   

    socket.on('sendLocation', (location, time, user, callback) => {
        io.emit('locationMessage', `https://google.com/maps?=${location.latitude},${location.longitude}`, time ,user)
        callback();
    });   

    socket.on('disconnect', () => {
        io.emit('messsage', 'a user has left')
    })
});


server.listen(port, () =>{
    console.log("connected!");
})