const express = require('express');
const router = express.Router();
const Cart = require('../models/favorite');
const Property =  require('../models/property');
const Order = require('../models/order');
const User = require('../models/user');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
        //Windows does not accept filenames with ':' hence we need to replace it with '-' as shown above
    }
});
const fileFilter = (req, file, cb)=>{
    if(file.mimetype.match(/jpeg|jpe|png|jpg$i/)){
        //accept a file
        cb(null, true);
    }else {
        //reject a file //does not save file
        cb(new Error("Only JPG and PNG files allowed"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6 //Not Greater than 2MB
    },
    fileFilter: fileFilter
});  //This folder will be accessed by multer to store incoming files

//Tinify Credentials
const tinify = require("tinify");
tinify.key = "LLB01pQ5cbp2tZ9GSHdSpHcg5CyhbqV3";

//Routes for Post Property
router.get('/post-prop', isLoggedIn, function(req, res,next){
    res.render('post-prop/post-property.hbs');
});



module.exports = router;

