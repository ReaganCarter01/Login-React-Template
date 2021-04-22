const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
require('../auth/auth');
const accessTokenSecret = "6fa8ad6c7c9a8a7034640a6d8a287bf2fa5089a0bf863e0e9b321968662447666d9921b598e7c42deb57e688";
const jwt = require('jsonwebtoken');
const userData= require('../schemas/User.js');
LocalStrategy           = require("passport-local");
passportLocalMongoose   = require("passport-local-mongoose");
const passport     = require("passport");
const app = express();
app.use(express.json());
const corsConfig = {
    origin: true,
    credentials: true,
};

mongoose.promise = global.Promise;
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
const PORT = process.env.PORT || 8080;
app.set('view engine','ejs');
const url = 'mongodb+srv://rgc63:user123@cluster0.mtays.mongodb.net/Poke?retryWrites=true&w=majority';
const initDataBase = async () => {

    database = await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    if (database) {app.use(session({
        secret: 'ItsASecretToEveryone',
        store: new MongoStore({mongooseConnection: mongoose.connection})

    }))
        mongoose.set("useCreateIndex", true);
        console.log('Succesfully connected to my DB');
    } else {
        console.log("Error connecting to my DB");
    }
}

const secureRoutes = require('../routes/secure-routes');
const routes = require('../routes/userRouter')

initDataBase().then(() => {
    app.use('/',routes);
    app.use('/user', passport.authenticate('jwt', { session: false }), secureRoutes);
    app.use('/', viewRouter);
    app.use('/auth/', authRouter);

});

app.use(morgan('tiny'));

app.listen(PORT);
console.log(`listening on port ${PORT}`);
mongoose.connection.on('connection',()=>{
    console.log("connection successful");
})