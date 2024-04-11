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

    /*  static async create(data) {
         const cart = await CartMongoDbDao.create(data);
         console.log(`Se creo el carrito exitosamente ${JSON.stringify(cart)}`);
         return cart;
     } */

    static async create(data) {
        try {
            const cart = await CartMongoDbDao.create(data);
            console.log(`Carrito creado exitosamente para el usuario ${data.user}`);
            return cart;
        } catch (error) {
            console.error(`Error al crear el carrito: ${error.message}`);
            throw error;
        }
    }

    static async resolve(cid, { status }) {
        return CartMongoDbDao.updateById(cid, { status });
    }

    static async addProduct(req, res) {
        try {
            const userId = req.params.uid;
            const { product, quantity } = req.body; // Asegúrate de corregir el typo aquí también

            const updatedCart = await CartMongoDbDao.addProductToCart(userId, product, quantity);

            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async clearCart(cartId) {
        try {
            return await CartMongoDbDao.clearCart(cartId);
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    }

    static async getCartByUserId(req, res) {
        try {
            const userId = req.params.uid;
            let cart = await CartMongoDbDao.getByUserId(userId);
            if (!cart) {
                // Opcional: crear un carrito si no existe
                cart = await CartMongoDbDao.create({ user: userId, products: [] });
            }
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createOrUpdateCartByUserId(req, res) {
        try {
            const userId = req.params.uid;
            const { products } = req.body;

            let cart = await CartMongoDbDao.getByUserId(userId);

            if (cart) {
                cart = await CartMongoDbDao.updateById(cart._id, { products });
            } else {
                cart = await CartMongoDbDao.create({ user: userId, products });
            }

            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async clearCartByUserId(req, res) {
        try {
            const userId = req.params.uid; // Captura el ID del usuario desde el parámetro de ruta
            await CartMongoDbDao.clearCartByUserId(userId); // Llama al DAO para vaciar el carrito
            res.json({ message: 'Carrito vaciado con éxito' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}