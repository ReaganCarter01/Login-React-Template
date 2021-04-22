import React, {createRef} from 'react';
import axios from 'axios';
import './signup.css';
import ReCAPTCHA from "react-google-recaptcha";
import Services from "../Services/Services";
import {token} from "morgan";
import Dashboard from "../../Dashboard";
const  mailFormat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/
const mongoose = require('mongoose');
const Strategy= require('passport-local').Strategy




const initialState = {
    username: "",
    email: "",
    password: "",
    captcha:false,
    confirmPassword:"",
    usernameError: "",
    emailError: "",
    passwordError: "",
    inputRef:"",
    captchaError:"",
    token
};



export default class Register extends React.Component{


    state = initialState;
    constructor(props) {
        super(props);
        this.inputRef = createRef();
    }

    handleChange = event => {

        const isCheckbox = event.target.type === "checkbox";
        this.setState({
            [event.target.name]: isCheckbox
                ? event.target.checked
                : event.target.value
        });
    };




//Check to see if ReCAPTCHA is filled out or if the captcha is expired
 handleChecked =async (event) => {
    console.log("here");
     console.log(event);
     let captcha = true;
     console.log(captcha);
      this.setState({captcha})
     console.log(this.state.captcha)

     if(event==null){
         let captcha = false;
         console.log(captcha);
         this.setState({captcha})
     }
}

/*FUNCTION: validate
* USE: Will validate user input and will find if username or email is in use
* RETURNS TRUE OR FALSE WHETHER THERE ARE ERRORS IN THE RESPECTED FIELDS */
    validate = () => {
        let usernameError = "";
        let emailError = "";
        console.log(token,"token");
        let captchaError = "";
        let passwordError = "";
        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const emailFormat= /[ `!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;

        const register ={
            username: this.state.username,
            email: this.state.email
        }
        const res = this.userEmail(register);
        const response = this.userHandler(register);
        console.log(res);
        console.log(response);
        const check = this.handleChecked;
        console.log(check);

        if (!this.state.username) {
            usernameError = "Username cannot be blank";
        }
        if (this.state.captcha === false) {
            captchaError = "Captcha not filled out";
        }
        if (format.test(this.state.username)) {
            usernameError = "Cannot contain special characters";
        }

        if (emailFormat.test(this.state.email)) {
            emailError = "Invalid Email";
        }

        if (this.state.username.length < 5) {
            usernameError = "Username must be more than 4 characters long";
        }
        if (this.state.email.length < 6) {
            emailError = "Invalid email";
        }
        if (this.state.username.length > 15) {
            usernameError = "Username  cannot be longer than 15 characters";
        }
        if (!this.state.email.includes("@")) {
            emailError = "invalid email";
        }
        if (!this.state.email.includes(".")) {
            emailError = "invalid email";
        }
        if (this.state.password.length < 8) {
            passwordError = "Password must be more than 8 characters long";
        }

        if (!this.state.password) {
            passwordError = "Password cannot be blank";
        }
        if (this.state.password !== this.state.confirmPassword) {
            passwordError = "Passwords do not match";
        }
        if (format.test(this.state.username)) {
            passwordError = "Cannot contain Special Characters";
        }


        if ( usernameError||emailError||passwordError||captchaError) {
            this.setState({ emailError, usernameError,passwordError,captchaError});
            return false;
        }

        return true;
    };

    handleSubmit = event => {
        let { history } = this.props;

        event.preventDefault();
        const register = {

            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,

        }


        const isValid = this.validate();

        if (isValid) {
         console.log("Put redirect here");
         this.loginEventHandler(register);
         this.props.handleSuccessfulAuth(register);
            this.props.history.push("/dashboard");
         this.inputRef.current.reset();
        }
    };



    async  userEmail(register) {

        try{
            let usernameError = "";
            let emailError = "";
            let passError = "";

            const response = (await axios.post('http://localhost:8080/find2', register)).data;
            console.log(response);
            if (response === "Email already exists") {
                emailError = "Email already exists";
                this.setState({emailError});
            }



        }catch(err){

        }

    }




    async  userHandler(register) {

        try{
            let usernameError = "";
            let emailError = "";
            let passError = "";

            const response = (await axios.post('http://localhost:8080/find', register)).data;
            console.log(response);
            if (response === "Username already exists") {
                usernameError = "Username already exists";
                this.setState({usernameError});
            }
            if (response === "Email already exists") {
                emailError = "Email already exists";
                this.setState({emailError});
            }



        }catch(err){

        }

    }
    
    async  loginEventHandler(register) {
        try{
            let usernameError = "";
            let emailError = "";
            let passError = "";

                const response = (await axios.post('http://localhost:8080/register', register)).data;
                console.log(response);

                if(response.username){
                    console.log("here");
                    this.props.handleSuccessfulAuth(response);
                }




            }catch(err){

        }

    }







    loginForm() {
        if (this.state.handleSuccessfulAuth) {
            return (
                <div>
                    <Dashboard login={this.state.handleLogin} accessToken={this.state.accessToken}/>
                    {alert("Logging in as " + this.state.username)}
                </div>
            )
        } else {
            return (
                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="uname" placeholder="username"><b>Username</b></label>
                        <input className="loginName" name="username"
                               placeholder="Username"
                               value={this.state.username}
                               onChange={this.handleChange}/>
                        <div style={{fontSize: 12, color: "red"}}>
                            {this.state.usernameError}
                        </div>
                        <label htmlFor="uname" placeholder="email"><b>Email</b></label>
                        <input className="loginName" name="email"
                               placeholder="email"
                               value={this.state.email}
                               onChange={this.handleChange}/>
                        <div style={{fontSize: 12, color: "red"}}>
                            {this.state.emailError}
                        </div>


                        <label htmlFor="psw" placeholder="password"><b>Password</b></label>
                        <input type="password" className="loginPass" name="password"
                               placeholder="password"
                               value={this.state.password}
                               onChange={this.handleChange}/>
                        <div style={{fontSize: 12, color: "red"}}>
                            {this.state.passwordError}
                        </div>


                        <label htmlFor="psw" placeholder="password"><b>Confirm Password</b></label>
                        <input type="password" className="loginPass" name="confirmPassword"
                               placeholder="password"
                               value={this.state.confirmPassword}
                               onChange={this.handleChange}/>
                        <ReCAPTCHA sitekey={process.env.REACT_APP_NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                   name="captcha" value={this.state.captcha} onChange={this.handleChecked}
                                   ref={this.inputRef}/>
                        <div style={{fontSize: 12, color: "red"}}>
                            {this.state.captchaError}
                        </div>
                        <button className="loginButton" type="submit"> Register</button>
                    </form>
                </div>
            )
        }
    }


    render(){

        return(
            <div className="Login">
                {this.loginForm()}
            </div>
        )
    }
}
