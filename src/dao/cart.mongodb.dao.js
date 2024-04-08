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
        // Primero, obtén el carrito del usuario
        let cart = await this.getByUserId(userId);
        if (!cart) {
            // Si no existe un carrito para el usuario, crea uno nuevo
            cart = new CartModel({ user: userId, products: [] });
        }

        // Verifica si el producto ya existe en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex > -1) {
            // Si el producto ya existe, simplemente actualiza la cantidad
            cart.products[productIndex].quantity += quantityToAdd;
        } else {
            // Si el producto no existe, añádelo al carrito
            cart.products.push({ product: productId, quantity: quantityToAdd });
        }

        // Guarda los cambios en el carrito
        await cart.save();
        return cart;
    }

    /*     static async addProductToCart(cartId, productId, quantity = 1) {
            try {
                const cart = await Cart.findById(cartId);
                if (!cart) {
                    throw new Error('Carrito no encontrado');
                }
    
                const product = await Product.findById(productId);
                if (!product) {
                    throw new Error('Producto no encontrado');
                }
    
                const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    
                if (productIndex > -1) {
                    cart.products[productIndex].quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }
    
                await cart.save();
                return cart;
            } catch (error) {
                throw new Error(`Error al añadir producto al carrito: ${error.message}`);
            }
        }
    
        static async removeProductFromCart(cartId, productId, quantity = 1) {
            const cart = await this.getById(cartId);
            if (!cart) throw new Error('Cart not found');
    
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity = Math.max(0, cart.products[productIndex].quantity - quantity);
                if (cart.products[productIndex].quantity === 0) {
                    cart.products.splice(productIndex, 1);
                }
            } else {
                throw new Error('Product not found in cart');
            }
    
            return cart.save();
        } */


    static async clearCart(cartId) {
        const cart = await this.getById(cartId);
        if (!cart) throw new Error('Cart not found');
        cart.products = []; // Vacía el arreglo de productos
        return cart.save();
    }
}