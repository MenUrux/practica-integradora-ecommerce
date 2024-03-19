import { Router } from 'express';
import passport from 'passport';
import UserModel from '../../dao/models/user.model.js';
import { createHash, isValidPassword } from '../../utils/utils.js'

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    console.log('req.user register', req.user);
    res.redirect('/profile');

})

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
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
    await UserModel.findByIdAndUpdate(user._id, { last_connection: new Date() }, { new: true });
    req.session.destroy((error) => {
        if (error) {
            return res.render('error', ({ title: 'Error | Ecommerce', messageError: error.message }))
        }
    })
    res.redirect('/login');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    console.log('req.user', req.user);
    req.session.user = req.user;
    res.redirect('/profile');
});

export default router;

