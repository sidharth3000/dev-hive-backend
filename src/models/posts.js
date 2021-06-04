const mongoose = require('mongoose')
const validator = require('validator')

const postsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true,
    }
})

const Posts = mongoose.model('Posts', postsSchema)

module.exports = Posts