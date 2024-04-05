import { Router } from 'express';
import { fakerES } from '@faker-js/faker'

const router = Router();




router.get('/', async (req, res, next) => {
    try {
        const mockingProducts = [];

        for (let i = 1; i <= 50; i++) {
            const product = {
                title: fakerES.commerce.productName(),
                description: fakerES.lorem.sentence(10),
                category: fakerES.commerce.department(),
                price: fakerES.commerce.price(),
                code: fakerES.string.alphanumeric(6),
                stock: fakerES.number.int({ min: 0, max: 100 }),
                images: [fakerES.image.url(), fakerES.image.url(), fakerES.image.url()]
            };
            mockingProducts.push(product);
        }
        req.logger.info('Realizando mocking de productos');
        res.json(mockingProducts);
    } catch (error) {
        next(error);
    }
});





export default router;