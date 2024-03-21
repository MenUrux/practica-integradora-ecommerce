import { Router } from 'express';
const router = Router();
import { ecommerceName } from '../../utils/utils.js';

router.get('/', (req, res) => {
  res.render('index', { title: `Inicio | ${ecommerceName}`, user: req.user ? req.user.toJSON() : null });

});

router.get('/chat', async (req, res) => {
  res.render('chat', { title: `Chat | ${ecommerceName}`, user: req.user ? req.user.toJSON() : null })
});


export default router;