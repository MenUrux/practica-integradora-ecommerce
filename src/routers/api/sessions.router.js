import { Router } from 'express';
import passport from 'passport';
import UserModel from '../../dao/models/user.model.js';
import { createHash, isValidPassword } from '../../utils/utils.js'
import NotificationsController from '../../controllers/mailer-and-sms.controller.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res, next) => {
    try {
        res.cookie('registered', 'true', { maxAge: 900000, httpOnly: false });

        console.log('req.user register', req.user);
        const { first_name, email } = req.user;
        await NotificationsController.sendWelcomeEmail({
            user: { first_name, email }
        }, res, next);
        res.json({ success: true, message: "Registro exitoso." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error en el registro." });
    }
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    const user = req.session.user;
    await UserModel.findByIdAndUpdate(user._id, { last_connection: new Date() }, { new: true });
    res.redirect('/profile');
});


router.get('/me', async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'No estás autenticado.' });
    }

    res.status(200).json(req.session.user);

});

router.get('/logout', async (req, res) => {
    const user = req.session.user;
    if (user && user._id) {
        try {
            await UserModel.findByIdAndUpdate(user._id, { last_connection: new Date() }, { new: true });
        } catch (error) {
            return res.render('error', ({ title: 'Error | Ecommerce', messageError: error.message }));
        }
    }

    req.session.destroy((error) => {
        if (error) {
            return res.render('error', ({ title: 'Error | Ecommerce', messageError: error.message }));
        }
        res.redirect('/login');
    });
});


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    console.log('req.user', req.user);
    req.session.user = req.user;

    res.redirect('/profile');
});

export default router;

