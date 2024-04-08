import { Router } from 'express';
import passport from 'passport';
import UserModel from '../../dao/models/user.model.js';
import { createHash, isValidPassword } from '../../utils/utils.js'
import NotificationsController from '../../controllers/mailer-and-sms.controller.js';
import CartsController from '../../controllers/cart.controller.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res, next) => {
    try {
        const { first_name, email, _id } = req.user;
        await NotificationsController.sendWelcomeEmail({
            user: { first_name, email }
        }, res, next);
        await CartsController.create({ user: _id, products: [] }); // Asume que CartsController.create puede manejar esto
        res.json({ success: true, message: "Registro exitoso." });
    } catch (error) {
        next(error);
    }
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
    try {
        req.session.user = req.user;
        const user = req.session.user;
        await UserModel.findByIdAndUpdate(user._id, { last_connection: new Date() }, { new: true });
        res.json({ success: true, message: "Login exitoso." });
    } catch (error) {
        next(error);
    }
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

