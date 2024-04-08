import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import productController from '../../controllers/product.controller.js';
import { __dirname, ecommerceName, buildResponsePaginated, siteUrl, upload } from '../../utils/utils.js';
import ProductModel from '../../dao/models/product.model.js';

const router = Router();

router.get('/products', async (req, res) => {
  const { limit = 12, page = 1, sort, search } = req.query;
  const criteria = {};
  const options = {
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    sort: sort ? { price: sort } : {}
  };

  if (search) {
    criteria.title = { $regex: search, $options: 'i' }; // Busca de forma insensible a mayúsculas y minúsculas
  }

  try {
    const result = await ProductModel.paginate(criteria, options);
    const data = buildResponsePaginated({ ...result, sort, search }, siteUrl, search, sort);

    console.log(req.user)
    res.render('products', { title: `Productos | ${ecommerceName}`, ...data, user: req.user ? req.user.toJSON() : null });

  } catch (error) {
    next(error);
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
