import { Router } from 'express';

const router = Router();

router.get('/debug', (req, res) => {
  if (!req.session.user) {
    return res.redirect('login');
  }

  console.log(req.user);
  res.render('debug', { title: 'DEBUG | Ecommerce', user: req.user.toJSON() });
  // res.render('profile', { title: 'Mi perfil | Ecommerce', user: req.user.toJSON() });
});

export default router;