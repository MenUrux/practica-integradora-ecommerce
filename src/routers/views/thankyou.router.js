import { Router } from 'express';
import { __dirname, ecommerceName } from '../../utils/utils.js';

const router = Router();

router.get('/thankyou', (req, res) => {
  res.render('thankyou', { title: `¡Muchas gracias! | ${ecommerceName}`, user: req.user ? req.user.toJSON() : null });
});

export default router;
