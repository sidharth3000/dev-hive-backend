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
    },
    time: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0

    },
    photo: {
        type: String
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Posts = mongoose.model('Posts', postsSchema)

module.exports = Posts