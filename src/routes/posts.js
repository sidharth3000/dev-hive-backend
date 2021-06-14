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


router.post('/create', auth ,upload.single('photo'), async (req,res) => {

    var thumb = null;

    if(req.file){
        const buffer = await sharp(req.file.buffer).jpeg().toBuffer()

        thumb = new Buffer(buffer).toString('base64');
    }

    const post = new Posts({
        ...req.body,
        owner: req.user._id,
        photo: thumb
    })

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

        var posts = await Posts.find({ owner:req.user._id})

        posts.reverse();

        // posts.populate('owner').execPopulate

        // posts.forEach(async (post) => {
        //     var thumb = new Buffer(post.photo).toString('base64');
        //      post.photo = thumb
        //     console.log(post.photo)
        //   });

    
        res.status(200).send(posts)
    }catch(e){
        res.status(400).send({Error: e.message})
    }
    
})

router.get('/posts', async (req, res) => {

    try {

        let posts = await Posts.find().populate("owner").populate("comment").exec()
        
        // await posts.populate("comment").execPopulate()

        posts.reverse();

        res.status(200).send(posts);

    }catch (e) {
        res.status(400).send({Error: e.message})
    }
})

router.post('/fullpost/', auth,  async( req, res) => {

    console.log(req.body)

    try {

        let post = await Posts.findById(req.body.id).populate("comment").populate("owner").exec()
        
        res.status(200).send(post);
        
    }catch (e) {
        res.status(400).send({Error: e.message})
    }
})

router.post('/post/del', auth ,async (req, res) => {

    try {

        await Posts.findOneAndDelete({ _id: req.body.id, owner:req.user._id});
        res.status(200).send('deleted')

    }catch(e) {
        res.status(400).send({Error: e.message})
    }
})

router.post('/like', auth, async (req, res) => {

    try{

        let liked = false

        let post = await Posts.findById(req.body.id)

        post.likedBy.forEach(async (user) => {
            if(user.id == req.user.id){
                liked = true;
            }
        });

        console.log(liked);

        if(liked){

            post.likedBy.forEach(async (item, index, object) => {
                if(item.id == req.user.id){
                    object.splice(index, 1);
                }
            });

            post.likes = post.likes-1;


        }else{

            let id = {
                id : req.user._id
            }

            post.likedBy = post.likedBy.concat(id)
            post.likes = post.likes+1;
        }

        post.save();

          console.log(post.likedBy)

        res.status(200).send(post);
    }catch (e) {
        res.status(400).send({Error: e.message})
    }
})

module.exports = router;
