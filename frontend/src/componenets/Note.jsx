import React, { useState } from "react";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import Footer from './Footer';
import config, { baseUrl } from "../config"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { makeStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function Note(props) {

    const [newNote , setnewNote] = useState({
      title: "",
      content: ""
    });
    const [note , setNote] = useState({
      notes: []
    })

    const classes = useStyles();
    const [openSnackBar , setOpenSnackBar] = useState(false);
    const[severity , setSeverity] = useState("");
    const [alert, setAlert] = useState("");

  useEffect(() => {
    fetch(config.baseUrl + "/notes" , {
      method:"GET",
      headers:{
        'Authorization' : 'Bearer ' + localStorage.getItem('token')
      },
    })
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp);
      if(resp.err){
        console.log(resp.err);
      }else{
        setNote(resp.note);
      }
    } , err => console.log(err))
    .catch(err => console.log(err));
  },[])

  function handleDeleteClick(noteId) {
    setNote(prevState => ({
      ...prevState,
      notes : note.notes.filter(note => note._id !== noteId)
    }))
    fetch(baseUrl + "/notes/" + note._id + "/" + noteId , {
      method:"DELETE",
      headers:{
        'Authorization' : 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(resp => resp.json())
    .then(resp => {
      if(resp.err){
        console.log(resp.err);
      }else{
        setNote(resp.note);
      }
    })
  }

  function handleChange(event){
    if(event.target.name === "title"){
      setnewNote(prevState => ({
        ...prevState,
        title: event.target.value
      }))
    }
    if(event.target.name === "content"){
      setnewNote(prevState => ({
        ...prevState,
        content: event.target.value
      }))
    }
  }

  function handleSubmit(event){
    event.preventDefault();
    fetch(config.baseUrl + "/notes/" + note._id , {
      method: "PUT",
      headers: {
        'Content-Type':'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(newNote)
    })
    .then(resp => resp.json())
    .then(resp => {
      if(resp.err){
        console.log(resp.err)
      }else{
        setnewNote({
          title: "",
          content: ""
        })
        setNote(resp.note);
      }
    })
    .catch(err => console.log(err));
  }

  function renderNote(){
    return note.notes.map(note => 
      (
        <div key={note._id} className="note" style={{color:"grey"}}>
          <h1>{note.title}</h1>
          <p>{note.content}</p>
          <button onClick={() => handleDeleteClick(note._id)}>DELETE</button>
        </div>
      )
    )
  }

  function handleLogOut(){
    setTimeout(() => {
      localStorage.clear()
      props.setUser({authenticated: false,user: null})
    },500)
    setOpenSnackBar(true);
    setSeverity("success");
    setAlert("Logging Out!!");
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

  return (
    <React.Fragment>
      {!props.user.authenticated && <Redirect to='/login' />}
      <header>
        <div className="container">
          <div className="row">
            <h1 className="col-2">Keeper</h1>
            <button onClick={handleLogOut} className="offset-8 col-2 btn btn-outline-light btn-lg">Logout <ExitToAppIcon /></button>
          </div>
        </div>
      </header>
      <div>
        <form onSubmit={handleSubmit}>
          <input onChange={handleChange} name="title" autocomplete="off" 
            placeholder="Title" value={newNote.title}/>
          
          <textarea onChange={handleChange} name="content" autocomplete="off"
            placeholder="Take a note..." rows="3" value={newNote.content}/>
          
          <button type="submit"
          disabled={newNote.title === "" || newNote.content === ""}> 
            Add 
          </button>
        </form>
      </div>
      {renderNote()}
      <Footer />
      <div className={classes.root}>
        <Snackbar anchorOrigin={{ vertical:'top' , horizontal:'center'}} 
            open={openSnackBar} autoHideDuration={3000} 
            onClose={() => setOpenSnackBar(false)}
        >
            <Alert onClose={() => setOpenSnackBar(false)} severity={severity}>
            {alert}
            </Alert>
        </Snackbar>
      </div>
    </React.Fragment>
  );
}

export default Note;