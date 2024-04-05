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

    static async getOrCreateCartForUser(req, res) {
        const userId = req.user._id;

        let cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            cart = new CartModel({ user: userId, products: [] });
            await cart.save();
        }

        return cart;
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
        // await sendConfirmation(user.email, order); // proximamente para enviar orden a sms o email

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
            const userId = req.user._id;
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


    static async addToCart(req, res) {
        const userId = req.user._id; // Asume autenticación
        const { productId, quantity } = req.body;

        // Verificar existencia y stock del producto
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'No hay suficiente stock disponible' });
        }

        // Obtener o crear carrito
        let cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            cart = new CartModel({ user: userId, products: [] });
            await cart.save();
        }

        // Agregar o actualizar producto en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();

        // Responder al cliente
        res.status(200).json({ message: 'Producto añadido al carrito correctamente', cart });
    }
}