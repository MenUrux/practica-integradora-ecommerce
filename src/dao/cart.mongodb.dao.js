import CartModel from "./models/cart.model.js";

export default class CartMongoDbDao {
    static async get(criteria = {}, opts = {}) {
        return CartModel.find(criteria, opts);
    }

    static async getById(cid) {
        return CartModel.findById(cid).populate('products.product');
    }

    static create(data) {
        return CartModel.create(data);
    }

    static async updateById(cid, data) {
        return CartModel.findByIdAndUpdate(cid, { $set: data }, { new: true }).populate('products.product');
    }

    static async deleteById(uid) {
        return CartModel.deleteOne({ _id: uid });
    }

    static async getByUserId(userId) {
        return CartModel.findOne({ user: userId }).populate('products.product');
    }

    static async clearCartByUserId(userId) {
        const result = await CartModel.updateOne({ user: userId }, { $set: { products: [] } });
        return result;
    }

    static async addProductToCart(userId, productId, quantityToAdd) {
        if (!productId) {
            throw new Error('El ID del producto no está definido');
        }

        let cart = await this.getByUserId(userId);
        if (!cart) {
            console.log("No existe carrito, creando uno nuevo.");
            cart = await CartModel.create({ user: userId, products: [] });
        } else if (!cart.products) {
            console.log("Inicializando el arreglo de productos.");
            cart.products = [];
        }

        console.log("Carrito encontrado:", cart);
        console.log("ID del producto a buscar:", productId);

        const productIndex = cart.products.findIndex(item => item.product?.toString() === productId);

        if (productIndex > -1) {
            console.log("Producto encontrado en el carrito, actualizando cantidad.");
            cart.products[productIndex].quantity += quantityToAdd;
        } else {
            console.log("Producto no encontrado en el carrito, añadiendo nuevo producto.");
            cart.products.push({ product: productId, quantity: quantityToAdd });
        }

        try {
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
            throw new Error('Error al agregar producto al carrito');
        }
    }

    static async clearCart(cartId) {
        const cart = await this.getById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        console.log("Limpiando productos del carrito.");
        cart.products = [];
        return cart.save();
    }
}
