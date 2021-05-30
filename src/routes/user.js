const express = require('express')
const multer = require('multer')
const { Router } = require('express');

const User = require('../models/user')

const router = new express.Router()

const upload = multer({
    dest: 'avatars',
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

router.post('/upload', upload.single('avatar'), (req, res) => {
       
    res.status(200).send('uploded')
        
}, (error, req, res, next) => {
    res.status(500).send({error: error.message})
})

router.post('/', (req, res) =>{

    console.log(req.body)

const user = new User(req.body);
   
try{

    user.save().then(() => {
        // console.log(user)
        res.status(200).send(user)
    }).catch((e) => {
        // console.log('Error', e)
        res.status(400).send({error: e})
    })

}catch (e){
    res.status(400).send("ERROR!!!")
}

})

module.exports = router;

