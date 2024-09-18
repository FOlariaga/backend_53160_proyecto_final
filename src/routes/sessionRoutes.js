import { Router } from "express";
import passport from 'passport';
import nodemailer from 'nodemailer';

import config from "../config.js";
import { authorizationRole, createToken, verifyToken, isValidPassword, verifyRequiredBody, verifyMongoDBId } from '../services/utils.js';
import initAuthStrategies from '../auth/passport.strategies.js';
import DTOCurrent from "../services/dto.current.js";
import UsersController from "../controller/user.controller.js";


const usersController = new UsersController;
const router = Router()
initAuthStrategies();

router.post("/login", verifyRequiredBody(["email", "password"]), passport.authenticate("login", { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(async (err) => {
            if (err) {
                return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
            }
            const filter = { _id: req.session.user._id }
            const update = { last_connection: new Date()}
            // console.log(update.last_connection.getTime());
            

            await usersController.updateOne(filter, update)
            res.redirect('/profile');
            // return res.status(200).send({ origin: config.SERVER, payload: req.session.user});
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
})



router.get('/ghlogin', passport.authenticate('ghlogin', { scope: ['user'] }), async (req, res) => {
});

router.get('/ghlogincallback', passport.authenticate('ghlogin', { failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}` }), async (req, res) => {
    try {
        req.session.user = req.user
        req.session.save( async (err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

            const filter = { _id: req.session.user._id }
            const update = { last_connection: new Date()}

            await usersController.updateOne(filter, update)

            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.post("/register", verifyRequiredBody(['firstName', 'lastName', 'email', 'password']), passport.authenticate("register", { failureRedirect: `/register?error=${encodeURI('error para registrar al usuario')}` }), async (req, res) => {
    try {
        // res.redirect("/login")
        res.status(200).send({ origin: config.SERVER, payload: req.user })
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null })
    }
})


router.get("/logout", async (req, res) => {
    try {
        const filter = { _id: req.session.user._id }
        const update = { last_connection: new Date()}
        req.session.destroy(async (err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });

            await usersController.updateOne(filter, update)
            res.redirect('/login')
        })
    } catch (error) {

    }
})

router.get("/current", authorizationRole(["admin", "user", "premium"]), async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login")
    }
    const data = new DTOCurrent(req.session.user)
    console.log(data);

    res.status(200).send({ origin: config.SERVER, payload: data })
})

//cambiar de lugar
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_APP_USER,
        pass: config.GMAIL_APP_PASS
    }
});


export default router