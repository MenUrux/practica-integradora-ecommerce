import mongoose from 'mongoose';
import UserMongoDbDao from '../../src/dao/user.mongodb.dao.js';
import { describe, before, after, it } from 'mocha';
import { expect } from 'chai';

const mongodbUri = 'mongodb://localhost:27017/ecommerce-testing';

const userTest = {
    first_name: "Jorge",
    last_name: "Test",
    email: "JPtest@yopmail.com",
    password: "12341234",
    age: "25",
    role: "premium",
}

describe('Testing UserMongoDbDao', function () {
    before(async function () {
        await mongoose.connect(mongodbUri);
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
    });



    it('should retrieve all users as an array', async function () {
        const users = await UserMongoDbDao.get();
        expect(users).to.be.an('array');
    });

    it('should create a user successfully', async function () {
        const createdUser = await UserMongoDbDao.create(userTest);

        const createdUserObject = createdUser.toObject();

        expect(createdUserObject).to.include({
            email: userTest.email,
            first_name: userTest.first_name,
            last_name: userTest.last_name,
            role: userTest.role,
        });
        expect(createdUserObject.age).to.equal(parseInt(userTest.age));
        expect(createdUserObject).to.have.property('password');
    });



    after(async function () {
        try {
            await UserMongoDbDao.deleteByEmail(userTest.email);
        } catch (error) {
            console.error('Delete failed:', error);
        }
        await mongoose.disconnect();
    });
});