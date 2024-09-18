import passport, { Passport } from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import CartController from "../controller/cart.controller.js";

import UserController from "../controller/user.controller.js";
import { createHash, isValidPassword } from "../services/utils.js";
import config from "../config.js";


const cartController = new CartController()
const userController = new UserController()
const localStrategy = local.Strategy

const initAuthStrategies = () => {

    passport.use("login", new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const userSaved = await userController.getByEmail(username);

                if (userSaved && isValidPassword(password, userSaved.password)) {
                    const { password, ...filteredUserSaved } = userSaved;
                    return done(null, filteredUserSaved);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false)
            }
        }
    ))

    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const { firstName, lastName, email, password, age } = req.body

                const user = await userController.add({ firstName, lastName, email, password: createHash(password), age})

                if (user.exist) {
                    console.log(`el usuario ya se registro con el email ${email}`);
                    return done(null, false);
                }
                
                console.log(user.payload);

                await cartController.add(user.payload._id)

                return done(null, user.payload)

            } catch (err) {
                return done(err, false)
            }
        }
    ))


    passport.use("ghlogin", new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // console.log(profile);
                const email = profile._json?.email || null;

                if (email) {

                    const userSaved = await userController.getByEmail(email)

                    if (!userSaved) {
                        const user = {
                            firstName: profile._json.name.split(' ')[0],
                            lastName: profile._json.name.split(' ')[1],
                            email: email,
                            password: 'none'
                        }

                        const process = await userController.add(user)

                        return done(null, process)
                    } else {
                        return done(null, userSaved);
                    }


                } else {
                    return done(new Error('Faltan datos de perfil'), null);
                }

            } catch (err) {
                return done(err, false)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}
export default initAuthStrategies;