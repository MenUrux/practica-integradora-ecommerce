import express from 'express';
import TicketsController from '../../controllers/ticket.controller.js';
import TicketMongoDbDao from '../../dao/ticket.mongodb.dao.js';

const router = express.Router();

router.post('/create-ticket/:uid', TicketsController.createTicketFromCart);

router.get('/', async (req, res, next) => {
  try {
    const tickets = await TicketMongoDbDao.get({});
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
});

router.get('/tickets/:tid', async (req, res) => {
  try {
    const { tid } = req.params;
    const ticket = await TicketMongoDbDao.getById(tid);
    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
});

router.put('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;  // Datos que desees actualizar

    const updatedTicket = await TicketMongoDbDao.updateById(id, updateData);
    if (!updatedTicket) {
      return res.status(404).send('Ticket not found');
    }
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
});

router.delete('/:tid', async (req, res, next) => {
  try {
    const { tid } = req.params;
    await TicketMongoDbDao.deleteById(tid);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
