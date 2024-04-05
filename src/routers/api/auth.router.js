import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';
import passport from 'passport';
import { generateResetToken, validateToken, authMiddleware, authRolesMiddleware } from '../../utils/utils.js'
import { generateLoggerMessage } from '../../utils/logger.js'
import crypto from 'crypto';
import UserMongoDbDao from '../../dao/user.mongodb.dao.js';
import MailerAndSmsController from '../../controllers/mailer-and-sms.controller.js';
import AuthController from '../../controllers/auth.controller.js';


const router = Router();

router.post('/register', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const newUser = await UsersController.create(req.body);
    if (newUser) {
      const newCart = await CartModel.create({ user: newUser._id });
      res.status(201).json({ user: newUser, cart: newCart });
    }
  } catch (error) {
    next(error);
  }
});

const auth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'No estas autentificado' });
  }
  const payload = await validateToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'No estas autentificado' });
  }
  req.user = payload;
  next();
}

router.post('/login', UsersController.login);

router.get('/current', authMiddleware('jwt'), authRolesMiddleware('admin'), (req, res) => {
  req.logger.info(generateLoggerMessage(req));
  res.status(200).send(req.user);
});

router.post('/reset-password/request', MailerAndSmsController.sendPasswordResetEmail);

router.post('/reset-password', AuthController.resetPassword);


export default router;
