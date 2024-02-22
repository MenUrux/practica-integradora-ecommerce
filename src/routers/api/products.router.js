import { Router } from 'express';
import { buildResponsePaginated } from '../../utils/utils.js'
import ProductModel from '../../dao/models/product.model.js'
import CustomError from '../../utils/CustomError.js'
import EnumsError from '../../utils/EnumsError.js'
import { generatorIdError, generatorProductError } from '../../utils/CauseMessageError.js';
import ProductMongoDbDao from '../../dao/product.mongodb.dao.js';
import { generateLoggerMessage } from '../../utils/logger.js';
import ProductsController from '../../controllers/product.controller.js';

const router = Router();

const baseUrl = 'http://localhost:8080/'


router.get('/', async (req, res) => {
  req.logger.info(generateLoggerMessage(req));
  const { limit = 8, page = 1, sort, search } = req.query;
  const criteria = {};
  const options = { limit, page };

  if (sort) {
    options.sort = { price: sort };
  }

  if (search) {
    criteria.category = search;
  }

  const result = await ProductModel.paginate(criteria, options);

  const data = buildResponsePaginated({ ...result, sort, search }, baseUrl, search, sort);
  res.status(200).json(data);
});

router.get('/:pid', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { params: { pid } } = req;
    const product = await ProductsController.getById(pid);
    if (!product) {
      return res.status(401).json({ message: `Product id ${pid} not found 😨.` });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { body } = req;
    const {
      title,
      description,
      category,
      price,
      code,
      stock,
      thumbnail
    } = body;
    console.log(title, description, category, price, code, stock, thumbnail)
    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !code ||
      !stock ||
      !thumbnail
    ) {
      CustomError.create({
        name: 'Invalid data product',
        cause: generatorProductError({
          title,
          description,
          category,
          price,
          code,
          stock,
          thumbnail
        }),
        message: 'Ocurrio un error mientras se intentaba crear un nuevo producto.',
        code: EnumsError.BAD_REQUEST_ERROR
      })
    }

    const product = await ProductsController.create(body)
    res.status(201).json(product)
  } catch (error) {
    next(error);
  }
})


export default router;


