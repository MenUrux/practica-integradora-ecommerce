import OrderDao from "../dao/order.mongodb.dao.js"
import UserDao from "../dao/user.mongodb.dao.js"
import BusinessDao from "../dao/business.mongodb.dao.js"

export default class OrdersController {

    static async get(filter = {}, opts = {}) {
        const orders = await OrderDao.get(filter, opts);
        console.log(`Ordenes encontrados: ${orders.length}`);
        return orders;
    }

    static async getById(oid) {
        const order = await OrderDao.getById(oid);
        if (order) {
            console.log(`Se encontro la orden exitosamente ${JSON.stringify(order)}`);
        }
        return order;

    }

    static async create(data) {
        const {
            business: bid,
            user: uid,
            products
        } = data;

        const business = await BusinessDao.getById(bid);
        const user = await UserDao.getById(uid);

        const { products: productsIntoBusiness } = business;
        const productsResult = productsIntoBusiness.filter(product => products.includes(product.id));
        const total = productsResult.reduce((accumulator, product) => {
            accumulator += product.price;
            return accumulator;
        }, 0)
        //Crear uid con el import, no con date.
        const code = Date.now();
        const order = await OrderDao.create({
            code,
            business: bid,
            user: uid,
            products: productsResult.map(p => p.id),
            total,
        });

        console.log(`Se creo la orden exitosamente ${JSON.stringify(order)}`);
        const { orders } = user;
        orders.push(order);
        await UserDao.updateById(uid, { orders });
        return order;
    }

    static async resolve(oid, { status }) {
        return OrderDao.updateById(oid, { status });

    }


}