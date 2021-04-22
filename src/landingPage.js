import React from 'react';

import './App.css';
import Home from './components/pages/HomePage/Home';
import Services from './components/pages/Services/Services';
import Products from './components/pages/Products/Products';
import Register from './components/pages/SignUp/Register';
import Login from './components/pages/Login/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from '././components/Navbar';
import Footer from '../src/components/pages/Footer.js/Footer'
import Dashboard from "./components/Dashboard";


class Landing extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedInStatus: "NOT_LOGGED_IN",
            user: {}
        };
        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleLogin(data) {
        console.log("In login handle")
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
        console.log(this.state.loggedInStatus)
    }



    handleLogout() {
        this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            user: {}
        });
    }


    handleSuccessfulAuth(register) {
     console.log(register)
        this.handleLogin(register);
        console.log("in auth");
    }



    homepage(){
        if(this.state.loggedInStatus === "NOT_LOGGED_IN" )
        return(
            <Router>
                <Navbar />
                <Switch>
                    <Route
                        exact
                        path={"/"}
                        render={props => (
                            <Home
                                {...props}
                                handleLogout={this.handleLogout}
                                loggedInStatus={this.state.loggedInStatus}
                            />
                        )}
                    />
                    <Route path='/services'  component={Services} />
                    <Route path='/products' component={Products} />
                    <Route
                        exact
                        path={"/register"}
                        render={props => (
                            <Register
                                {...props}
                                handleLogout={this.handleLogout}
                                handleSuccessfulAuth={this.handleSuccessfulAuth}
                                loggedInStatus={this.state.loggedInStatus}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={"/login"}
                        render={props => (
                            <Login
                                {...props}
                                handleLogout={this.handleLogout}
                                handleSuccessfulAuth={this.handleSuccessfulAuth}
                                loggedInStatus={this.state.loggedInStatus}
                            />
                        )}
                    />
                </Switch>
                <Footer />
            </Router>

        )
        if(this.state.loggedInStatus === "LOGGED_IN" ){
            return (
                <Router>
            <Dashboard/>
                    <Route
                        exact
                        path={"/dashboard"}
                        render={props => (
                            <Home
                                {...props}
                                handleLogout={this.handleLogout}
                                loggedInStatus={this.state.loggedInStatus}
                            />
                        )}
                        />
                    <Footer/>
                </Router>
            )
        }

    }

    render(){
        return(
           this.homepage()
        )
    }
}

export default Landing;