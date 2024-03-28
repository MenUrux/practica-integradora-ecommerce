import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import productController from '../../controllers/product.controller.js';
import { __dirname, ecommerceName, buildResponsePaginated, siteUrl } from '../../utils/utils.js';
import ProductModel from '../../dao/models/product.model.js';



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

router.get('/products', async (req, res) => {
  const { limit = 12, page = 1, sort, search } = req.query;

  const criteria = {};
  const options = { limit, page };

  if (sort) {
    options.sort = { price: sort };
  }

  if (search) {
    criteria.category = search;
  }

  try {
    const result = await ProductModel.paginate(criteria, options);
    const data = buildResponsePaginated({ ...result, search, sort }, siteUrl, search);
    res.render('products', { title: `Productos | ${ecommerceName}`, ...data, user: req.user ? req.user.toJSON() : null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});



router.post('/products', upload.single('thumbnail'), async (req, res) => {
  try {
    let relativePath = '';
    if (req.file) {
      relativePath = path.relative(path.join(__dirname, '../public'), req.file.path);
    }

    const newProductData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      code: req.body.code,
      stock: req.body.stock,
      thumbnail: relativePath
    };

    await productController.createProduct(newProductData);
    res.redirect('/products');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/products/:pid', async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productController.getById(pid);
    if (!product) {
      res.status(404).render('errorView', {
        message: `No se encontró un producto con el ID ${pid}.`,
        error: { status: 404, stack: 'Producto no encontrado' }
      });
    } else {
      res.render('product', { title: `${product.title} | ${ecommerceName}`, user: req.user ? req.user.toJSON() : null, product: product.toJSON() });
    }
  } catch (error) {
    next(error);
  }
});


export default router;
