import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';
import { generateLoggerMessage } from '../../utils/logger.js';
import { upload } from '../../utils/utils.js';


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

/* // Poner premium a un usuario
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
}); */


/* const documents = req.files.map(file => ({
  name: file.originalname,
  reference: `${siteUrl}/uploads/documents/${file.filename}`
})); */

router.post('/:uid/documents',
  upload.fields([
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobanteDomicilio', maxCount: 1 },
    { name: 'estadoCuenta', maxCount: 1 }
  ]),
  async (req, res) => {
    const { uid } = req.params;
    try {
      const userDocuments = [
        {
          name: 'Identificación',
          reference: req.files['identificacion'] ? req.files['identificacion'][0].path : null
        },
        {
          name: 'Comprobante de domicilio',
          reference: req.files['comprobanteDomicilio'] ? req.files['comprobanteDomicilio'][0].path : null
        },
        {
          name: 'Comprobante de estado de cuenta',
          reference: req.files['estadoCuenta'] ? req.files['estadoCuenta'][0].path : null
        }
      ].filter(doc => doc.reference !== null);

      if (userDocuments.length !== 3) {
        return res.status(400).json({ message: 'No se han cargado todos los documentos necesarios.' });
      }

      await UsersController.addDocumentsToUser(uid, userDocuments);

      const premiumUpdateResult = await UsersController.updateToPremium(uid);

      if (premiumUpdateResult) {
        res.status(200).json({ message: 'Usuario actualizado a premium correctamente.' });
      } else {
        res.status(400).json({ message: 'No se pudo actualizar al usuario a premium.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });

router.post('/:uid/avatar',
  upload.single('avatar'), // Usamos 'single' ya que es un único archivo
  async (req, res) => {
    const { uid } = req.params;
    try {
      // req.file contiene la información del archivo de imagen cargado
      const avatarPath = req.file ? req.file.path : null;

      if (!avatarPath) {
        return res.status(400).json({ message: 'No se ha cargado el avatar.' });
      }

      // Actualiza el avatar del usuario en la base de datos
      const updatedUser = await UsersController.updateUserAvatar(uid, avatarPath);

      res.status(200).json({
        message: 'Avatar actualizado correctamente.',
        user: updatedUser
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);



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