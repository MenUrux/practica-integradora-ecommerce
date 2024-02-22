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

    static async verifyStock(cartId) {
        const cart = await CartModel.findById(cartId).populate('products.product');
        let isStockAvailable = true;

        for (let item of cart.products) {
            const product = await ProductModel.findById(item.product._id);
            if (item.quantity > product.stock) {
                isStockAvailable = false;
                // Opcionalmente, ajusta la cantidad del producto en el carrito aquí
                // item.quantity = product.stock;
            }
        }

        await cart.save();
        return isStockAvailable;
    }

}