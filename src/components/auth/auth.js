const bcrypt = require('bcrypt');
const passport = require ('passport');
const localStrategy = require('passport-local').Strategy;
const userModel = require('./../schemas/User');


const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
    'login',
    new localStrategy(
        {
            username: 'username',
            password: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ username });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
)

passport.use(
    new JWTstrategy(
        {
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);