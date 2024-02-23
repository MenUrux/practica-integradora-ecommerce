import OrderDao from "../dao/order.mongodb.dao.js"
import UserDao from "../dao/user.mongodb.dao.js"
import CartMongoDbDao from '../dao/cart.mongodb.dao.js';
import TicketMongoDbDao from '../dao/ticket.mongodb.dao.js';
import ProductModel from '../dao/models/product.model.js'; // Asegúrate de que la ruta sea correcta
import UserModel from '../dao/models/user.model.js'; // Asegúrate de que la ruta sea correcta

export default class CartsController {

    static async get(filter = {}, opts = {}) {
        const carts = await OrderDao.get(filter, opts);
        console.log(`Ordenes encontrados: ${orders.length}`);
        return carts;
    }

    static async getById(cid) {
        const cart = await OrderDao.getById(cid);
        if (cart) {
            console.log(`Se encontro la orden exitosamente ${JSON.stringify(cart)}`);
        }
        return cart;

    }

    static async create(data) {
        const cart = await CartMongoDbDao.create(data);
        console.log(`Se creo el usuario exitosamente ${JSON.stringify(cart)}`);
        return cart;
    }

    static async resolve(oid, { status }) {
        return OrderDao.updateById(oid, { status });

    }

    static async finalizePurchase(cartId, userId) {
        const cart = await CartMongoDbDao.getCart(cartId);
        let total = 0;

        // Verificar el stock y calcular el total
        for (let item of cart.products) {
            const product = await ProductModel.findById(item.product._id);
            if (item.quantity > product.stock) {
                return {
                    error: "Stock insuficiente para el producto " + product.title,
                    availableStock: product.stock,
                    // suggestedAction: 'adjustQuantity' // Proximamente
                };
            }
            total += item.quantity * product.price;
        }

        // Actualizar el inventario
        for (let item of cart.products) {
            const product = await ProductModel.findById(item.product._id);
            product.stock -= item.quantity;
            await product.save();
        }


        // Enviar confirmación al usuario
        const user = await UserModel.findById(userId);
        await sendConfirmation(user.email, order); // proximamente para enviar orden a ig o email

        // Generar el ticket
        const ticket = await TicketMongoDbDao.createTicket({
            userId,
            orderId: order._id,
            total,
        });

        // Vaciar el carrito (opcional)
        cart.products = [];
        await cart.save();

        return { success: true, order, ticket };
    }
}