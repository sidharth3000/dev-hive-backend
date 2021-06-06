const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { Router } = require('express');

const Posts = require('../models/posts')
const auth = require('../middleware/auth')

const router = new express.Router()

const upload = multer({
    limits:{
        fileSize: 20000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return  cb(new Error('File must be a jpg, jpeg or png'))
        }

        cb(undefined, true)
    }
})

router.post('/create', auth , upload.single('photo'), async (req,res) => {

    const buffer = await sharp(req.file.buffer).jpeg().toBuffer()

    const post = new Posts({
        ...req.body,
        owner: req.user._id
    })

    // post.photo = buffer

    try{
       await post.save()
       res.status(200).send(post)
    }
    catch (e) {
        res.status(400).send({Error: e.message})
    }
})

router.get('/posts/me', auth, async (req, res) => {

    try{

        const posts = await Posts.find({ owner:req.user._id})

        res.status(200).send(posts)
    }catch(e){
        res.status(400).send({Error: e.message})
    }
    
})

module.exports = router;
