import UserDao from "../dao/user.mongodb.dao.js"
import CartMongoDbDao from '../dao/cart.mongodb.dao.js';
import TicketMongoDbDao from '../dao/ticket.mongodb.dao.js';
import ProductModel from '../dao/models/product.model.js';
import UserModel from '../dao/models/user.model.js';

export default class CartsController {

    static async get(filter = {}, opts = {}) {
        const carts = await CartMongoDbDao.get(filter, opts);
        console.log(`Carts encontrados: ${carts.length}`);
        return carts;
    }

    static async getById(cid) {
        const cart = await CartMongoDbDao.getById(cid);
        if (cart) {
            console.log(`Se encontro el cart exitosamente ${JSON.stringify(cart)}`);
        }
        return cart;

    }

    static async create(data) {
        const cart = await CartMongoDbDao.create(data);
        console.log(`Se creo el carrito exitosamente ${JSON.stringify(cart)}`);
        return cart;
    }

    static async resolve(cid, { status }) {
        return CartMongoDbDao.updateById(cid, { status });

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


        const user = await UserModel.findById(userId);
        // await sendConfirmation(user.email, order); // proximamente para enviar orden a ig o email

        const ticket = await TicketMongoDbDao.createTicket({
            userId,
            orderId: order._id,
            total,
        });

        cart.products = [];
        await cart.save();

        return { success: true, order, ticket };
    }

    static async addToCart(req, res) {
        try {
            const userId = req.user._id; // Asegúrate de que req.user esté disponible
            const { productId, quantity } = req.body;

            let cart = await CartMongoDbDao.getByUserId(userId);
            if (!cart) {
                cart = await CartMongoDbDao.create(userId);
            }

            await CartMongoDbDao.addProductToCart(cart._id, productId, quantity);

            res.status(200).json({ message: 'Product added to cart successfully', cart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while adding the product to the cart' });
        }
    }

}