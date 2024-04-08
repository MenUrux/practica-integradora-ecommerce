import { Router } from 'express';
import { __dirname, ecommerceName } from '../../utils/utils.js';

const router = Router();

router.get('/payments', async (req, res) => {
  try {
    res.render('payments', { title: `Completa tu compra | ${ecommerceName}`, ...data, user: req.user ? req.user.toJSON() : null });

  } catch (error) {
    next(error);
  }
});

export default router;
