import OrderDao from "../dao/order.mongodb.dao.js"
import UserDao from "../dao/user.mongodb.dao.js"
import CartMongoDbDao from '../dao/cart.mongodb.dao.js';
import TicketMongoDbDao from '../dao/ticket.mongodb.dao.js';
import ProductModel from '../dao/models/product.model.js'; // Asegúrate de que la ruta sea correcta
import UserModel from '../dao/models/user.model.js'; // Asegúrate de que la ruta sea correcta

export default class CartsController {

    static async get(filter = {}, opts = {}) {
        const orders = await OrderDao.get(filter, opts);
        console.log(`Ordenes encontrados: ${orders.length}`);
        return orders;
    }

    static async getById(oid) {
        const order = await OrderDao.getById(oid);
        if (order) {
            console.log(`Se encontro la orden exitosamente ${JSON.stringify(order)}`);
        }
        return order;

    }

    static async create(data) {
        const {
            business: bid,
            user: uid,
            products
        } = data;

        const business = await OrderDao.getById(bid);
        const user = await UserDao.getById(uid);

        const { products: productsIntoCart } = cart;
        const productsResult = productsIntoCart.filter(product => products.includes(product.id));
        const total = productsResult.reduce((accumulator, product) => {
            accumulator += product.price;
            return accumulator;
        }, 0)
        //Crear uid con el import, no con date.
        const code = Date.now();
        const order = await OrderDao.create({
            code,
            business: bid,
            user: uid,
            products: productsResult.map(p => p.id),
            total,
        });

        console.log(`Se creo la orden exitosamente ${JSON.stringify(order)}`);
        const { orders } = user;
        orders.push(order);
        await UserDao.updateById(uid, { orders });
        return order;
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