const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { Router } = require('express');

const User = require('../models/user')
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

router.post('/upload', auth,  upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).jpeg().toBuffer()

    req.user.avatar = buffer
    console.log(req.user.avatar)
    await req.user.save()
    res.status(200).send('uploded')
        
}, (error, req, res, next) => {
    res.status(500).send({error: error.message})
})

router.get('/avatar', auth, async (req, res) => {
    try{
        if(req.user.avatar){
            var thumb = new Buffer(req.user.avatar).toString('base64');
            res.status(200).send(thumb);
        }else{
            res.send(201).send()
        }
        
    }catch(e){
        res.status(400).send()
    }
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


router.post('/register', async (req, res) =>{
 console.log('register')
try{
    const user = new User(req.body);
    const token = await user.generateAuthToken()
    res.status(200).send({user, token})

    }catch (e){
        res.status(400).send({Error: e.message})
    }

    })


router.post('/login', async (req, res) =>{
    console.log("login")
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (e) {
        res.status(400).send({"Error": e.message})
    }

})


router.patch('/user/name', auth, async (req, res) => {
    const name = req.body
    console.log(name)

    try {
         req.user.name = req.body.name
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/user/me', auth, async (req, res) => {
    console.log("reached")
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router;

