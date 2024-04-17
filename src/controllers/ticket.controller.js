import CartMongoDbDao from '../dao/cart.mongodb.dao.js';
import TicketMongoDbDao from '../dao/ticket.mongodb.dao.js';
import MailerAndSmsController from '../controllers/mailer-and-sms.controller.js';
import UserModel from '../dao/models/user.model.js';

class TicketsController {
    static async createTicketFromCart(req, res) {
        console.log('Create ticket');
        try {
            const { uid } = req.params;
            const user = await UserModel.findById(uid);

            console.log(user);

            if (!user) {
                console.log('No user found for ID:', uid);
                throw new Error('User not found');
            }


            const cart = await CartMongoDbDao.getByUserId(user._id);
            if (!cart) {
                console.log('No cart found for user ID:', user._id);
                return res.status(404).send('Carrito no encontrado');
            }

            const ticketData = {
                purchaser: user._id,
                products: cart.products,
                amount: TicketsController.calculateTotal(cart.products),
                total: TicketsController.calculateTotal(cart.products)
            };

            console.log('Ticket data:', ticketData);

            const ticket = await TicketMongoDbDao.create(ticketData);
            const ticketDetails = await TicketsController.getTicketDetails(ticket._id);

            await MailerAndSmsController.sendPurchaseConfirmationEmail(ticket._id, ticketDetails, user._id);

            await CartMongoDbDao.clearCartByUserId(user._id);

            res.status(201).json(ticket);
        } catch (error) {
            console.error("Error processing ticket creation:", error);
            res.status(500).json({ error: error.message });
        }

    }

    static calculateTotal(products) {
        return products.reduce((acc, { product, quantity }) => acc + (product.price * quantity), 0);
    }

    static async getTicketDetails(ticketId) {
        try {
            const ticket = await TicketMongoDbDao.getById(ticketId);

            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }

            return {
                products: ticket.products.map(p => ({
                    name: p.product.title,
                    price: p.product.price,
                    quantity: p.quantity,
                    subtotal: p.quantity * p.product.price
                })),
                total: ticket.total
            };
        } catch (error) {
            console.error('Error obteniendo detalles del ticket:', error);
            throw error;
        }
    }

}

export default TicketsController;
