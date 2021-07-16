const express = require('express');
const Users = require('../models/user');
const passport = require('passport');
const userRouter = express.Router();
const {getJWT, verifyToken, verifyUser} = require('../authenticate');
const cors = require('../cors');

userRouter.options('/login' , cors.cors , (req,res,next) => {res.sendStatus("200")});
userRouter.post('/login' , cors.corsWithOpts , (req,res,next) => {
    passport.authenticate('local' , {session:false} , (err , user ,info) => {
        if(err){
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Login Failed !!" , err:info});
        }
        if(!user){
            res.statusCode = 401;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Login Failed !!" , err:info});
        }
        if(user){
            req.logIn(user , {session:false} , (err) => {
                if(err){
                    res.statusCode = 401;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:false , status:"Login Failed" , err:info})
                }else{
                    res.setHeader('Content-Type','application/json');
                    res.statusCode = 200;
                    res.json({success:true , status: "Login Successfully !!" , token:getJWT(req.user._id) , user:user});
                }
            })
        }
    })(req,res,next)
})

userRouter.options('/register' , cors.cors , (req,res,next) => {res.sendStatus("200")})
userRouter.post('/register' , cors.corsWithOpts , (req,res,next) => {
    Users.register({username: req.body.username} , req.body.password , (err,user) => {
        console.log(err);
        console.log(user)
        if(err){
            res.status(500).send({success: false , status: "Registration Unsuucessfull !!" , err: err})
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!' , userId: user._id});
        }
    })
})

module.exports = userRouter;