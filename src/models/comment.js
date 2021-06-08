const mongoose = require('mongoose')
const validator = require('validator')

const commentSchema = new mongoose.Schema({
    body:{
        type: String,
        required: true
    },
    post: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment