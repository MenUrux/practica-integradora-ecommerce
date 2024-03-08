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

    static async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getById(cartId);
        if (!cart) throw new Error('Cart not found');

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return cart.save();
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
    }
}