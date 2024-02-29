import { Router } from 'express';
import CartsController from '../../controllers/cart.controller.js';
import ProductsController from '../../controllers/product.controller.js';
import { generateLoggerMessage } from '../../utils/logger.js';

// import TicketsController from '../../controllers/tickets.controller.js';

const router = Router();

router.get('/', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const carts = await CartsController.get({});
    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
});

router.get('/:uid', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { params: { uid } } = req;
    const cart = await CartsController.getById(cid);
    if (!cart) {
      return res.status(401).json({ message: `Cart id ${cid} not found 😨.` });
    }
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const cart = await CartsController.create(body);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
});

router.put('/:uid', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { body, params: { uid } } = req;
    const updateResult = await CartsController.update(cid, body);
    if (updateResult) {
      // Usuario actualizado correctamente, devolver datos actualizados
      res.status(200).json(updateResult);
    } else {
      // Usuario no encontrado
      res.status(404).json({ message: `Cart id ${cid} not found 😨.` });
    }
  } catch (error) {
    next(error);
  }
});


router.delete('/:uid', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  try {
    const { params: { uid } } = req;
    const deleteResult = await CartsController.delete(uid);
    if (deleteResult) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: `Cart id ${uid} not found 😨.` });
    }
  } catch (error) {
    next(error);
  }
});

// router.post('/register', async (req, res, next) => {
//   req.logger.info(generateLoggerMessage(req));
//   try {
//     const newCart = await CartsController.register(req.body);
//     res.status(201).json(newCart);
//   } catch (error) {
//     next(error);
//   }
// });


router.post('/add', async (req, res, next) => {
  try {
    if (!req.cart) {
      return res.status(400).json({ error: 'Cart not found' });
    }
    const cartId = req.cart._id;

    const { productId, quantity } = req.body;

    let cart = await CartMongoDbDao.getById(cartId);
    if (!cart) {
      cart = await CartMongoDbDao.create({ cart: cartId, products: [] });
    }

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex !== -1) {

      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity: quantity });
    }

    await CartMongoDbDao.updateById(cart._id, { products: cart.products });

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});



//Todavía sigo arreglando esto.
router.post('/:cid/purchase', async (req, res, next) => {
  req.logger.info(generateLoggerMessage(req));
  const cartId = req.params.cid;

  try {
    // Obtener el carrito
    const cart = await CartsController.getById(cartId);

    if (!cart) {
      return res.status(404).json({ message: `Cart id ${cartId} not found 😨.` });
    }

    let totalAmount = 0;
    let failedProducts = [];
    let successfulProducts = [];

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verificar el stock para cada producto en el carrito
      for (const item of cart.items) {
        const product = await ProductsController.getById(item.productId);

        if (product && product.stock >= item.quantity) {
          totalAmount += item.quantity * product.price;
          product.stock -= item.quantity;
          await product.save({ session });
          successfulProducts.push(item.productId);
        } else {
          failedProducts.push(item.productId);
        }
      }

      // Si todos los productos están en stock, crear un ticket
      if (failedProducts.length === 0) {
        const ticketData = {
          purchaser: cart.email,
          amount: totalAmount,

        };
        const ticket = await TicketsController.create(ticketData, { session });

        // Confirmar la transacción
        await session.commitTransaction();

        res.status(201).json({ ticket, message: "Compra completada exitosamente." });
      } else {
        // Si algunos productos fallaron, abortar la transacción
        await session.abortTransaction();

        res.status(400).json({ failedProducts, message: "Algunos productos no tienen stock." });
      }
    } catch (transactionError) {
      // Manejar errores que ocurren durante la transacción
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }
  } catch (error) {
    next(error);
  }
});


export default router;