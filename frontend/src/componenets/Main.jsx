import React, { useState } from 'react';

import Register from './Register';
import Login from './Login';
import Note from "./Note";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function Main(){

    const [user , setUser] = useState(localStorage.getItem('user') || {authenticated: false,user: null});

    return (
        <React.Fragment>
            <Router>
                <Switch>
                    <Route path="/register">
                        <Register user={user} />
                    </Route>
                    <Route path="/login">
                        <Login user={user} setUser={setUser} />
                    </Route>
                    <Route path="/dashboard">
                        <Note user={user} setUser={setUser}/>
                    </Route>
                    <Route path='/'>
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </React.Fragment>
    )
}

export default Main;