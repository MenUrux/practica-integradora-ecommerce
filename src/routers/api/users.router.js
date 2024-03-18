import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';
import { generateLoggerMessage } from '../../utils/logger.js';


const router = Router();

router.get('/', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const users = await UsersController.get({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:uid', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { params: { uid } } = req;
    const user = await UsersController.getById(uid);
    if (!user) {
      return res.status(401).json({ message: `User id ${uid} not found 😨.` });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { body } = req;
    const user = await UsersController.create(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:uid', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { body, params: { uid } } = req;
    const updateResult = await UsersController.update(uid, body);
    if (updateResult) {
      res.status(200).json(updateResult);
    } else {
      res.status(404).json({ message: `User id ${uid} not found 😨.` });
    }
  } catch (error) {
    next(error);
  }
});

// Poner premium a un usuario
router.put('/premium/:uid', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { params: { uid } } = req;
    const user = await UsersController.getById(uid);

    if (!user) {
      return res.status(404).json({ message: `User id ${uid} not found 😨.` });
    }

    user.role = user.role === 'user' ? 'premium' : 'user';

    const updateResult = await UsersController.update(uid, { role: user.role });

    if (updateResult) {
      res.status(200).json({ message: `User role updated to ${user.role}.` });
    } else {
      res.status(404).json({ message: `Unable to update user id ${uid}.` });
    }
  } catch (error) {
    next(error);
  }
});


router.delete('/:uid', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { params: { uid } } = req;
    const deleteResult = await UsersController.delete(uid);
    if (deleteResult) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: `User id ${uid} not found 😨.` });
    }
  } catch (error) {
    next(error);
  }
});




export default router;