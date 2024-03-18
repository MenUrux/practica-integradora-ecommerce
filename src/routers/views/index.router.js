import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Inicio | Ecommerce', user: req.user ? req.user.toJSON() : null });

});

router.get('/chat', async (req, res) => {
  res.render('chat', { title: 'Chat | Ecommerce', user: req.user ? req.user.toJSON() : null })
});


export default router;