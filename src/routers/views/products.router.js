import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import productController from '../../controllers/product.controller.js';
import { __dirname, ecommerceName } from '../../utils/utils.js';

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
      res.render('product', { title: `${product.title} | ${ecommerceName}`, product: product.toJSON() });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/login', (req, res) => {
  res.render('login', { title: `Iniciar sesión | ${ecommerceName}`, messageError: 'Correo o contraseña inválidos.' });
});


export default router;
