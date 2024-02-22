import { Router } from 'express';
import UserModel from '../../dao/models/user.model.js';

const router = Router();

router.get('/register', (req, res) => {
  res.render('register', { title: 'Registrarse | Ecommerce' });
});


router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar sesión | Ecommerce', messageError: 'Correo o contraseña inválidos.' });
});


router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('login');
  }
  res.render('profile', { title: 'Mi perfil | Ecommerce', user: req.user.toJSON() });
  // res.render('profile', { title: 'Mi perfil | Ecommerce', user: req.user.toJSON() });
});

export default router;