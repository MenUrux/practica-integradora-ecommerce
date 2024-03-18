import { Router } from 'express';
import UserModel from '../../dao/models/user.model.js';
import { ecommerceName } from '../../utils/utils.js'

const router = Router();

router.get('/register', (req, res) => {
  res.render('register', { title: `Iniciar sesión | ${ecommerceName}` });
});


router.get('/login', (req, res) => {
  res.render('login', { title: `Iniciar sesión | ${ecommerceName}`, messageError: 'Correo o contraseña inválidos.' });
});


router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('login');
  }
  res.render('profile', { title: `Mi perfil | ${ecommerceName}`, user: req.user.toJSON() });
  // res.render('profile', { title: 'Mi perfil | Ecommerce', user: req.user.toJSON() });
});

export default router;