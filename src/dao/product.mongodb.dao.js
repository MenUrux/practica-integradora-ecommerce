import ProductModel from "./models/product.model.js";

export default class ProductMongoDbDao {
    static get(criteria = {}, opts = {}) {
        return ProductModel.find(criteria, opts);
    }
    static getById(pid) {
        return ProductModel.findById(pid);
    }
    static create(data) {
        return ProductModel.create(data);
    }
    static updateById(pid, data) {
        const criteria = { _id: pid };
        const operation = { $set: data }
        return ProductModel.updateOne(criteria, operation);
    }
    static deleteById(pid) {
        const criteria = { _id: pid };
        return ProductModel.deleteOne(criteria);
    }

}