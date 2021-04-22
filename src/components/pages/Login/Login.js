import React, {createRef} from 'react';
import axios from 'axios';
import './login.css';
import landingPage from "../../../landingPage";
import Services from "../Services/Services";
import {token} from "morgan";
import ReCAPTCHA from "react-google-recaptcha";



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

export default class Login extends React.Component{
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

validateHuman = async (token) => {
    const secret = process.env.REACT_APP_NEXT_RECAPTCHA_KEY;

    console.log(process.env.REACT_APP_NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
    const response = await fetch (`https://www.google.com/recaptcha/api/siteverify?${secret}&response=${token}`,{
        method: "POST"
    })
    const data = await response.json();
    console.log(data);
    return false;
}


//Check to see if ReCAPTCHA is filled out or if the captcha is expired
    handleChecked = async (event) => {
        console.log("here");
        console.log(event);
        let token = event;
        let captcha = true;
        console.log(captcha);
        this.setState({captcha})
        this.setState({token})
        console.log(this.state.captcha)
        if(event==null){
            let captcha = false;
            console.log(captcha);
            this.setState({captcha})
        }
    }


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
            password:this.state.password
        }
        const response = this.userHandler(register);
        console.log(response);
        const check = this.handleChecked;
        console.log(check);


        if (this.state.captcha === false) {
            captchaError = "Captcha not filled out";
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
            password: this.state.password,
        }
        const isValid = this.validate();


        if (isValid) {
            console.log(register);
            console.log("Put redirect here");
            this.loginEventHandler(register);
            this.inputRef.current.reset();
        }
    };


    async  userHandler(register) {

        try{
            let usernameError = "";
            let emailError = "";
            let passError = "";

            const response = (await axios.post('http://localhost:8080/locate', register)).data;
            console.log(response);
            if (response === "Username or Password incorrect") {
                usernameError = "Username or Password incorrect";
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

            const response = (await axios.post('http://localhost:8080/login', register)).data;
            console.log(response);



        }catch(err){

        }

    }







    loginForm(){
        return(
            <div className="container" >
                <form  onSubmit={this.handleSubmit}>

                    <label htmlFor="uname" placeholder="username"><b>Username</b></label>
                    <input  className="loginName"   name="username"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleChange}  />
                    <div style={{ fontSize: 12, color: "red" }}>
                        {this.state.usernameError}
                    </div>
                    <label htmlFor="psw" placeholder="password"><b>Password</b></label>
                    <input type="password" className= "loginPass"  name="password"
                           placeholder="password"
                           value={this.state.password}
                           onChange={this.handleChange} />
                    <div style={{ fontSize: 12, color: "red" }}>
                        {this.state.passwordError}
                    </div>


                    <ReCAPTCHA sitekey={process.env.REACT_APP_NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                               name="captcha" value={this.state.captcha} onChange={this.handleChecked}  ref ={this.inputRef}  />
                    <div style={{ fontSize: 12, color: "red" }}>
                        {this.state.captchaError}
                    </div>
                    <button className="loginButton" type="submit"> Log In </button>
                </form>
            </div>


        )
    }


    render(){

        return(
            <div className="Login">
                {this.loginForm()}
            </div>
        )
    }
}
