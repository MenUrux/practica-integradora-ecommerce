import chai from 'chai';
import config from '../src/config/config.js';

mongoose.connect(config.mongodbUri);

const expect = chai.expect;
const requester = supertest(config.mongodbUri)

const assert = Assert.strict;
describe('Testing User dao', function () {

    it('El dao debe obtener todos los usuarios en formato de array', async function () {
        const result = await UserMongoDbDao.get(); // Usa directamente UserMongoDbDao.get()
        assert.strictEqual(Array.isArray(result), true);
    });
});
