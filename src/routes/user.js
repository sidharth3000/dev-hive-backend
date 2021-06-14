const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { Router } = require('express');

const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

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

    console.log(req.file.buffer)
    
    const buffer = await sharp(req.file.buffer).jpeg().toBuffer()

    var thumb = new Buffer(buffer).toString('base64');

    req.user.avatar = thumb
    await req.user.save()
    res.status(200).send('uploded')
        
}, (error, req, res, next) => {
    res.status(500).send({error: error.message})
})


router.get('/avatar', auth, async (req, res) => {
    try{

        // var thumb = new Buffer(req.user.avatar).toString('base64');
        res.status(200).send(req.user.avatar);
       
        
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
 console.log(req.body)
try{
    const user = new User(req.body);
    const token = await user.generateAuthToken()
    sendWelcomeEmail(user.email, user.name)
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
        sendCancelationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router;

