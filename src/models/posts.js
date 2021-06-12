const mongoose = require('mongoose')
const validator = require('validator')

const postsSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true
    },
    body: {
        type: String,
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
    likedBy: [{
        id: {
            type: mongoose.Schema.Types.ObjectId
        }
    }],
    photo: {
        type: String
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

postsSchema.virtual('comment', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
})

postsSchema.set('toObject', { virtuals: true });
postsSchema.set('toJSON', { virtuals: true });

const Posts = mongoose.model('Posts', postsSchema)

module.exports = Posts