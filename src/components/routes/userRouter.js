const express = require('express');
const mongoose = require('mongoose');
const userRouter = express.Router();
const passport = require('passport');
const app = express ();
const jwt = require('jsonwebtoken');
const userData = require('../schemas/User');
const bcrypt = require("bcrypt");
const accessTokenSecret = "6fa8ad6c7c9a8a7034640a6d8a287bf2fa5089a0bf863e0e9b321968662447666d9921b598e7c42deb57e688";


function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user
        next();
    })
}

userRouter.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            {
                successRedirect: '/products',
                failureRedirect: '/login',
                failureFlash: true
            },
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');
                        console.log(err);
                        return next(error);
                    }
                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = { _id: user._id, username: user.username};
                            const token = jwt.sign({ user: body }, 'TOP_SECRET');

                            return res.json({ token });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

/*
app.post('/login', async (req, res) => {
    try {
        let errors = {};
        const {username, password} = req.body;
        const user = await userData.findOne({username, password});
        if (user) {
            //User was found, create a token!
            const accessToken = jwt.sign({user}, accessTokenSecret,{expiresIn: "15s"});
            res.send({accessToken: accessToken});
        } else {
            errors.username = "Username or Password incorrect";
            console.log("username exists")
            console.log(errors.username);
            res.send(errors.username);
            return 0;
        }
    }
    catch(e){
        return res.status(400).send(e)
    }
})
*\
 */
userRouter.post('/find',async(req,res)=>{

   try {
       let errors = {};
       const {username, email} = req.body;
       const users = await userData.findOne({username});
       const pass = await userData.findOne({email});


       if (users) {
           errors.username = "Username already exists";
           console.log("username exists")
           console.log(errors.username);
           res.send(errors.username);
           return 0;

       } else if (pass) {
           errors.email = "Email already exists";
           console.log("email already exists");
           res.send(errors.email);
           return 0;
       }
   }catch (e){
       console.log(e);
       res.status(404);
   }
})


userRouter.post('/locate',async(req,res)=>{
    try {
        let errors = {};
        const {username, password} = req.body;
        const users = await userData.findOne({username});



        if (!users) {
            errors.username = "Username or Password incorrect";
            console.log("username exists")
            console.log(errors.username);
            res.send(errors.username);
            return 0;

        }
        if (!bcrypt.compareSync(password, password)) {
            errors.email = "Username or Password incorrect";
            console.log("email already exists");
            res.send(errors.email);
            return 0;
        }
    }catch (e){
        console.log(e);
        res.status(404);
    }
})




userRouter.post('/register',async(req,res)=>{
    try {

        const test = req.body;
        const user = await userData.create(test);
        console.log("creating user....");
        res.send(user);
    }catch(e){
        res.status(404);

    }
})



module.exports = userRouter;