const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const userRouter = require('./routes/user')
const postsRouter = require('./routes/posts')
const commentRouter = require('./routes/comment')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user')

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

    socket.on('join', (username, room, callback) => {

        const {error, user} = addUser({id: socket.id, username, room })

        if(error) {
            callback(error)
        }

        socket.join(room)

        socket.emit('message', "Welcome!", "12:30", "Admin");
        socket.broadcast.to(room).emit('message', `${username} has joined!`, "12:30", "Admin");

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();
    })

    socket.on('sendMessage', (mssg, d, user,  callback) => {

        const u = getUser(socket.id);

        const filter = new Filter()

        if(filter.isProfane(mssg)){
            return callback('Profanity is not allowed')
        }

        io.to(u.room).emit('message', mssg, d, user)
        callback();
    });   

    socket.on('sendLocation', (location, time, user, callback) => {
        
        io.emit('locationMessage', `https://google.com/maps?=${location.latitude},${location.longitude}`, time ,user)
        callback();
    });   

    socket.on('disconnect', () => {

        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', `${user.username} has left!`, "12:30", "Admin")
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    
        
    })
});


server.listen(port, () =>{
    console.log("connected!");
})