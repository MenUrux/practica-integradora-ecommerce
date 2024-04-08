import { Router } from 'express';
import { buildResponsePaginated, siteUrl, upload } from '../../utils/utils.js'

import { generateLoggerMessage } from '../../utils/logger.js';
import PaymentsService from '../../services/payments.services.js'

const router = Router();

const mockCart = [
  { id: 1, name: 'papas', price: 100 },
  { id: 2, name: 'queso', price: 50 },
  { id: 3, name: 'hamburguesa', price: 200 },
  { id: 4, name: 'pancho', price: 100 }
]

router.post('/payment-intents', async (req, res) => {
  const { query: { id } } = req;
  const product = mockCart[id];

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }

  const service = new PaymentsService();
  const result = await service.createPaymentIntent({
    amount: product.amount,
    currency: 'usd',
  })

  console.log(result);
  res.json({ status: 'success', payload: result });
})

router.get('/', async (req, res) => {

  try {
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

export default router;


