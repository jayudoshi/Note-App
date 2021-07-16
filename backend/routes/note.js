const express = require('express');
const Notes = require('../models/note');
const Users = require('../models/user');
const passport = require('passport');
const noteRouter = express.Router();
const {getJWT, verifyToken, verifyUser} = require('../authenticate');
const cors = require('../cors');

noteRouter.options('/' , cors.cors , (req,res,next) => {res.sendStatus("200")});
noteRouter.get('/' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    Notes.findOne({userId: req.user._id} , (err,note) => {
        if(err){
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Bad Request!!" , err:err});
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true , status:"Request Succesfull!!" , note:note})
        }
    })
    .populate('userId')
})

noteRouter.post('/' , cors.corsWithOpts , (req,res,next) => {
    Notes.create({userId: req.body.userId , notes: []} , (err,note) => {
        if(err){
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Bad Request!!" , err:err});
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true , status:"Request Succesfull!!" , note:note})
        }
    })
})

noteRouter.options('/:noteId' , cors.cors , (req,res,next) => {res.sendStatus("200")});
noteRouter.get('/:noteId' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    Notes.findById(req.params.noteId , (err,note) => {
        if(err){
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Bad Request!!" , err:err});
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true , status:"Request Successsfull!!" , note:note});
        }
    }).populate('userId')
})

noteRouter.put('/:noteId' , cors.corsWithOpts , verifyUser , (req,res,next) => {
    Notes.findById(req.params.noteId , (err,note) => {
        if(err){
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Bad Request!!" , err:err});
        }else{
            note.notes.push(req.body);
            note.save((err,updatedNote) => {
                if(err){
                    res.statusCode = 403;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:false , status:"Bad Request!!" , err:err});
                }else{
                    Notes.findById(updatedNote._id , (err,notes) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json({success:true , status:"Request Successfull" , note:notes})
                    }).populate('userId')
                }
            })
        }
    })
})

noteRouter.options('/:notesId/:noteId' , cors.cors , (req,res,next) => {res.sendStatus("200")});
noteRouter.delete('/:notesId/:noteId' , cors.corsWithOpts , verifyUser , (req,res,next) =>{
    Notes.findById(req.params.notesId , (err,note) => {
        if(err){
            res.statusCode = 403;
            res.setHeader('Content-Type','application/json');
            res.json({success:false , status:"Bad Request!!" , err:err});
        }else{
            note.notes.id(req.params.noteId).remove();
            note.save((err,notes) => {
                if(err){
                    res.statusCode = 403;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:false , status:"Bad Request!!" , err:err});
                }else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({success:true , status:"Request Successfull" , note:notes})
                }
            })
        }
    })
})

module.exports = noteRouter