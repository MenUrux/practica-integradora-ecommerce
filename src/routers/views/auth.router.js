import { Router } from 'express';
import { ecommerceName } from '../../utils/utils.js';

const router = Router();

router.get('/auth/reset-password', async (req, res) => {
  try {
    const { token } = req.query;
    console.log(token);

    res.render('reset-password', {
      title: `Recuperar contraseña | ${ecommerceName}`,
      token // Envía el token a la plantilla,
      , user: req.user ? req.user.toJSON() : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});


export default router;
