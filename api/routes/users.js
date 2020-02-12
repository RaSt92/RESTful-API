const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const user = require('../models/user');
const bcrypt = require('bcrypt')
router.post('/signup', (req, res, next)=>{
    user.find({email: req.body.email}).exec().then(user => {
        if(user){
            return res.status(409).json({
                message: 'Email exists'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash)=> {
                if(user.length >= 1){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new user({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });
                user
                .save()
                .then(result => {
                    res.status(201).json({
                        message:'User created'
                    })
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
            }
        });
        }
    })
    .catch();
    
});
router.delete('/:userId', (req,res,next)=>{
    user.remove({_id: req.params.userId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'User deleted'
        })
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
});
});

module.exports = router;