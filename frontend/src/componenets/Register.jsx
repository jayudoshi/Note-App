import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { baseUrl } from '../config';

import Header from "./Header";
import Footer from "./Footer";

import { FormGroup , FormFeedback } from 'reactstrap';

import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

function Register(props){

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
    const [status , setStatus] = useState(false);

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
            }else if(credentials.username.length < 2){
              setUsername(prevState => ({
                ...prevState,
                err: "Username should be minimumm of 2 characters long!!",
                valid: false
              }))
            }else if(credentials.username.length >= 48){
              setUsername(prevState => ({
                ...prevState,
                err: "Username can be maximum of 48 characters long!!",
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
            }else if(credentials.password.length < 8){
              setPassword(prevState => ({
                ...prevState,
                err: "Password should be minimumm of 8 characters long!!",
                valid: false
              }))
            }else if(credentials.password.length >= 22){
              setPassword(prevState => ({
                ...prevState,
                err: "Password can be maximum of 22 characters long!!",
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
    
    function handleErr(resp){
        if(resp.err.name === "UserExistsError"){
          setUsername(prevState => ({
            ...prevState,
            focus: true,
            err: "Username already exists!!",
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
        }
    }
    
    function handleSuccess(resp){
        setTimeout(() => {
            setCredentials({ username:"", password:"", name:"" });
            setUsername({ focus: false, err: "", valid: null });
            setPassword({ focus: false, err: "", valid: null });
            setStatus(true);
        } , 1000)
        setOpenSnackBar(true);
        setSeverity("success");
        setAlert(resp.status);
    }
    
    function handleSubmit(event){
        event.preventDefault();
        fetch(baseUrl + '/users/register' , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        .then(resp => {
          return resp.json()
        })
        .then(resp => {
            console.log(resp)
          if(!resp.success){
            handleErr(resp)
          }else{
              console.log(resp.userId)
            fetch(baseUrl + '/notes/' , {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId: resp.userId})
            })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if(response.err){
                    handleErr(response)
                }else{
                    handleSuccess(resp)
                }
            })
          }
        })
        .catch(err => console.log(err))
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return (
        <React.Fragment>
            {status && <Redirect to="/login"/>}
            {props.user.authenticated && <Redirect to="/dashboard" />}
            <Header />
            <div>
                <form onSubmit={handleSubmit} style={{fontSize: '2rem'}}>
                    <FormGroup style={{margin:"2%"}}>
                        <h1 style={{color:"grey" , fontFamily:"inherit"}}>Register Page</h1>
                    </FormGroup>
                    <FormGroup style={{margin:"2%"}}>
                        <input name="username" placeholder="Username"
                        valid={username.focus && username.valid} 
                        invalid={username.focus ? username.valid === false : false} 
                        onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                        value={credentials.username} autocomplete="off"
                        />
                        <hr></hr>
                        <FormFeedback style={{fontFamily:"inherit" , fontSize:"0.9rem"}} invalid>{username.err}</FormFeedback>
                    </FormGroup>
                    <FormGroup style={{margin:"2%"}}>
                        <input name="password" placeholder="Password" type="password"
                        valid={password.focus && password.valid} 
                        invalid={password.focus ? password.valid === false : false}
                        onChange={handleChange} onFocus={handleFocus} onBlur={validate} 
                        value={credentials.password} autocomplete="off"
                        />
                        <hr></hr>
                        <FormFeedback style={{fontFamily:"inherit" , fontSize:"0.9rem"}} invalid>{password.err}</FormFeedback>
                    </FormGroup>
                    <FormGroup style={{margin:"2%" , padding:"1%" , fontSize:"1.2rem" , color:"grey"}}>
                        Already an User? <Link to='/login' style={{color:"grey"}}>Login</Link>
                    </FormGroup>
                    <button style={{fontSize: '1.2rem'}} className="registerBtn" type="submit"
                    disabled={!username.valid || !password.valid} >
                    Register
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

export default Register;