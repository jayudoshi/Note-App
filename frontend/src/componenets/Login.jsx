import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import config from '../config';

import Header from "./Header";
import Footer from "./Footer";

import { FormFeedback, FormGroup } from 'reactstrap';

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

function Login(props){

    const [credentials,setCredentials] = useState({username:"",password:""});
    const [username , setUsername] = useState({
      focus: false,
      err: "",
      valid: null
    });
    const [password , setPassword] = useState({
      focus: false,
      err: "",
      valid: null
    });

    const classes = useStyles();
    const [openSnackBar , setOpenSnackBar] = useState(false);
    const[severity , setSeverity] = useState("");
    const [alert, setAlert] = useState("");

    function handleChange(event){
        if(event.target.name === "password"){
            if(credentials.password !== ""){
                setPassword(prevState => ({
                    ...prevState,
                    err:"",
                    valid: true
                }))
            }
        }
        setCredentials(prevState => ({
          ...prevState,
          [event.target.name]: event.target.value
        }))
    }

    function handleFocus(event){
        if(event.target.name === "username"){
          setUsername(prevState => ({
            ...prevState,
            focus: true
          }))
        }else if(event.target.name === "password"){
          setPassword(prevState => ({
            ...prevState,
            focus: true
          }))
        }
    }

    function validate(event){
        if(event.target.name === "username"){
          if(username.focus){
            if(credentials.username === "" ){
              setUsername(prevState => ({
                ...prevState,
                err: "Username can't be empty!!",
                valid: false
              }))
            }else{
              setUsername(prevState => ({
                ...prevState,
                err:"",
                valid: true
              }))
            }
          }
        }else if(event.target.name === "password"){
          if(password.focus){
            if(credentials.password === "" ){
              setPassword(prevState => ({
                ...prevState,
                err: "Password can't be empty!!",
                valid: false
              }))
            }else{
              setPassword(prevState => ({
                ...prevState,
                err:"",
                valid: true
              }))
            }
          }
        }
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function handleSuccess(resp){
        setTimeout(() => {
          props.setUser(prevState => ({
              ...prevState,
              user: resp.user,
              authenticated: true
          }))
          setCredentials({ username:"", password:""});
          setUsername({ focus: false, err: "", valid: null });
          setPassword({ focus: false, err: "", valid: null });
      } , 1000)
        setOpenSnackBar(true);
        setSeverity("success");
        setAlert(resp.status);
        localStorage.setItem('token',resp.token);
    }

    function handleErr(resp){
        if(resp.err.name === "IncorrectUsernameError"){
          setUsername(prevState => ({
            ...prevState,
            focus: true,
            err: "Incorrect Username!!",
            valid: false
          }))
          setPassword({ focus: false, err: "", valid: null });
          setCredentials(prevState => ({
            ...prevState,
            password:""
          }))
          setOpenSnackBar(true);
          setSeverity("error")
          setAlert(resp.status);
        }else if(resp.err.name === "IncorrectPasswordError"){
          setCredentials(prevState => ({
            ...prevState,
            password:""
          }))
          setUsername(prevState => ({
            ...prevState,
            focus: true,
            err: "",
            valid: true
          }))
          setPassword(prevState => ({
            ...prevState,
            focus: true,
            err: "Incorrect Password!!",
            valid: false
          }))
          setOpenSnackBar(true);
          setSeverity("error")
          setAlert(resp.status);
        }else{
          setOpenSnackBar(true);
          setSeverity("error")
          setAlert(resp.err.message);
        }
    }

    function handleSubmit(event){
        event.preventDefault();
        fetch(config.baseUrl + "/users/login" , {
          method: "POST",
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify(credentials)
        })
        .then(resp => resp.json())
        .then(resp=>{
          if(resp.err){
            handleErr(resp)
          }else{
            handleSuccess(resp)
          }
        })
        .catch(err => console.log(err))
    }

    return (
        <React.Fragment>
            {props.user && props.user.authenticated && <Redirect to="/dashboard" />}
            <Header />
            <div>
                <form onSubmit={handleSubmit} style={{fontSize: '2rem'}}>
                    <FormGroup style={{margin:"2%"}}>
                        <h1 style={{color:"grey" , fontFamily:"inherit"}}>Login Page</h1>
                    </FormGroup>
                    
                    <FormGroup style={{margin:"2%"}}>
                        <input name="username" placeholder="Username" autocomplete="off"
                        invalid={username.focus ? username.valid === false : false} 
                        onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                        value={credentials.username}
                        />
                        <hr></hr>
                        <FormFeedback style={{fontFamily:"inherit" , fontSize:"0.9rem"}} invalid>{username.err}</FormFeedback>
                    </FormGroup>
                    
                    <FormGroup style={{margin:"2%"}}>
                        <input name="password" placeholder="Password" type="password" autcomplete="off"
                        invalid={password.focus ? password.valid === false : false}
                        onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                        value={credentials.password}
                        />
                        <hr></hr>
                        <FormFeedback style={{fontFamily:"inherit" , fontSize:"0.9rem"}} invalid>{password.err}</FormFeedback>
                    </FormGroup>
                   
                    <FormGroup style={{margin:"2%" , padding:"1%" , fontSize:"1.2rem" , color:"grey"}}>
                        Not a User? <Link to='/register' style={{color:"grey"}}>Register</Link>
                    </FormGroup>
                   
                    <button style={{fontSize: '1.2rem'}} type="submit"
                    className="loginBtn"
                    disabled={!username.valid || !password.valid}>
                    Login
                    </button>
                </form>
            </div>
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
    )
}

export default Login;