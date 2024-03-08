import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import { describe, before, after, it } from 'mocha';
import app from '../../src/app.js';
const mongodbUri = 'mongodb://localhost:27017/ecommerce-testing';

describe('User auth', () => {
    before(async function () {
        await mongoose.connect(mongodbUri);
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        await mongoose.connection.db.dropDatabase();
    });

    it('Register user', async () => {
        const res = await request(app)
            .post('/api/sessions/register')
            .send({
                first_name: "Jorge",
                last_name: "Test",
                email: "JPtest@yopmail.com",
                password: "12341234",
                age: "25",
                role: "premium",
            });
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.include({
            email: "JPtest@yopmail.com",
            first_name: "Jorge",
            last_name: "Test",
            role: "premium",
        });
    });

    it('Log in the user', async () => {
        const res = await request(app)
            .post('/api/sessions/login')
            .send({
                email: "JPtest@yopmail.com",
                password: "12341234",
            });
    });

    after(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });
});
