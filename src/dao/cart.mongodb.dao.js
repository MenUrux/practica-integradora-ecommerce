import CartModel from "./models/cart.model.js";

export default class CartMongoDbDao {
    static async get(criteria = {}, opts = {}) {
        return CartModel.find(criteria, opts);
    }
    static async getById(cid) {
        return CartModel.findById(cid);
    }
    static create(data) {
        return CartModel.create(data);
    }
    static async updateById(cid, data) {
        const criteria = { _id: cid };
        const operation = { $set: data }
        return CartModel.updateOne(criteria, operation);
    }
    static async deleteById(uid) {
        const criteria = { _id: uid };
        return CartModel.deleteOne(criteria);
    }

    static async getByUserId(userId) {
        return CartModel.findOne({ user: userId }).populate('products.product');
    }

    static async updateById(cartId, updateData) {
        return CartModel.findByIdAndUpdate(cartId, updateData, { new: true }).populate('products.product');
    }

    static async getByUserId(userId) {
        return Cart.findOne({ user: userId }).populate('products.product');
    }

    static async create(userId) {
        const cart = new Cart({ user: userId, products: [] });
        await cart.save();
        return cart;
    }

    static async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error('Cart not found');

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    }

    static async removeProductFromCart(cartId, productId, quantity = 1) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error('Cart not found');

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            if (cart.products[productIndex].quantity > quantity) {
                cart.products[productIndex].quantity -= quantity;
            } else {
                cart.products.splice(productIndex, 1);
            }
            await cart.save();
            return cart;
        } else {
            throw new Error('Product not found in cart');
        }
    }
}