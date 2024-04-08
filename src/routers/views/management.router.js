import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import productController from '../../controllers/product.controller.js';
import { __dirname, ecommerceName, buildResponsePaginated, siteUrl } from '../../utils/utils.js';
import ProductModel from '../../dao/models/product.model.js';
import ProductsController from '../../controllers/product.controller.js';



const router = Router();
const uploadsDir = path.join(__dirname, '../public/uploads/');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/management', async (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const { limit = 999, page = 1, sort, search } = req.query;

  // Añadir el ID del usuario autenticado al criterio de búsqueda
  const criteria = { owner: req.user._id }; // Ajusta el campo según tu esquema de producto
  const options = { limit: parseInt(limit, 10), page: parseInt(page, 10), sort: {} };

  if (sort) {
    options.sort = { price: sort };
  }

  if (search) {
    criteria.title = { $regex: search, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
  }

  try {
    const result = await ProductModel.paginate(criteria, options);
    const data = buildResponsePaginated({ ...result, search, sort }, siteUrl, search);
    console.table(data.payload);
    res.render('management', { title: `Administración | ${ecommerceName}`, ...data, user: req.user ? req.user.toJSON() : null });
  } catch (error) {
    next(error);
  }
});





export default router;
