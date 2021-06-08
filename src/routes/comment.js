const express = require('express')
const { Router } = require('express');

const Comment = require('../models/comment')
const auth = require('../middleware/auth')

const router = new express.Router()


router.post('/comment', auth , async (req,res) => {

    try{
       var comment = new Comment({
           ...req.body,
           author: req.user._id
       })

       comment.save();

       console.log(comment)

       res.status(200).send(comment)
    }
    catch (e) {
        res.status(400).send({Error: e.message})
    }
})


module.exports = router;
