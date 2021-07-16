const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const logger = require('morgan');
const passport = require('passport')

const userRouter = require('./routes/user');
const noteRouter = require('./routes/note');

const PORT = 9000;
const HOSTNAME = "localhost"
const DB_URL = "'mongodb://localhost:27017/noteApp"

mongoose.connect(DB_URL , { useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true} , (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Connected To Database !!");
    }
})

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize())

app.use('/users' , userRouter);
app.use('/notes' , noteRouter);

const httpServer = http.createServer(app);
httpServer.listen(PORT,HOSTNAME, () => {
    console.log('Server running at port 9000');
})