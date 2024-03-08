import mongoose from 'mongoose';
import ProductMongoDbDao from '../../src/dao/product.mongodb.dao.js';
import { describe, before, after, it } from 'mocha';
import { expect } from 'chai';

const mongodbUri = 'mongodb://localhost:27017/ecommerce-testing';

const productTest = {
    title: "Play Station 5",
    description: "Sony Playstation 5 1tb digital",
    category: "Consola",
    price: 800,
    code: "PS2015",
    stock: 5,
    thumbnail: "..public/assets/images/no-image.png",
};

describe('Testing ProductMongoDbDao', function () {
    before(async function () {
        await mongoose.connect(mongodbUri);
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
    });

    it('should retrieve all products as an array', async function () {
        const products = await ProductMongoDbDao.get();
        expect(products).to.be.an('array');
    });

    it('should create a product successfully', async function () {
        const createdProduct = await ProductMongoDbDao.create(productTest);
        const createdProductObject = createdProduct.toObject();

        expect(createdProductObject).to.include({
            title: productTest.title,
            description: productTest.description,
            category: productTest.category,
            price: productTest.price,
            code: productTest.code,
            stock: productTest.stock,
        });

        expect(createdProductObject).to.have.property('thumbnail').that.is.a('string');

        this.productId = createdProductObject._id;
    });

    it('should update the stock of a product', async function () {
        const newStock = 12;
        await ProductMongoDbDao.updateById(this.productId, { stock: newStock });
        const updatedProduct = await ProductMongoDbDao.getById(this.productId);
        // expect(updatedProduct).to.be.eql(200);
        expect(updatedProduct).to.have.property('stock', newStock);
    });

    after(async function () {
        if (this.productId) {
            try {
                await ProductMongoDbDao.deleteById(this.productId);
            } catch (error) {
                console.error('Cleanup failed:', error);
            }
        }
        await mongoose.disconnect();
    });
});