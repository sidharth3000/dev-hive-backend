const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors');

const userRouter = require('./routes/user')
const postsRouter = require('./routes/posts')
const commentRouter = require('./routes/comment')

require('./db/mongoose')
         
const app = express()
const port = process.env.PORT || 9000

app.use(express.json())
app.use(cors({ origin: '*'}));
app.use(userRouter)
app.use(postsRouter)
app.use(commentRouter)

app.listen(port, () =>{
    console.log("connected!");
})