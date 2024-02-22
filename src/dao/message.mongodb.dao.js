import ProductModel from "./models/product.model.js";

export default class ProductMongoDbDao {
    static get(criteria = {}, opts = {}) {
        return ProductModel.find(criteria, opts);
    }
    static getById(uid) {
        return ProductModel.findById(uid);
    }
    static create(data) {
        return ProductModel.create(data);
    }
    static updateById(uid, data) {
        const criteria = { _id: uid };
        const operation = { $set: data }
        return ProductModel.updateOne(criteria, operation);
    }
    static deleteById(uid) {
        const criteria = { _id: uid };
        return ProductModel.deleteOne(criteria);
    }

}