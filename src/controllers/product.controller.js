import ProductDao from '../dao/product.mongodb.dao.js';

export default class ProductsController {

    static async get(filter = {}, opts = {}) {
        const users = await ProductDao.get(filter, opts);
        console.log(`Usuarios encontrados: ${users.length}`);
        return users;
    }

    static async getById(uid) {
        const user = await ProductDao.getById(uid);
        if (user) {
            console.log(`Se encontro el usuario exitosamente ${JSON.stringify(user)}`);
        }
        return user;
    }

    static async create(data) {
        const user = await ProductDao.create(data);
        console.log(`Se creo el usuario exitosamente ${JSON.stringify(user)}`);
        return user;
    }

    static async update(uid, data) {
        const updateResult = await ProductDao.updateById(uid, data);
        if (updateResult.modifiedCount === 0) {
            return null;
        }
        const updatedUser = await ProductDao.getById(uid);
        return updatedUser;
    }

    static async delete(uid) {
        const deleteResult = await ProductDao.deleteById(uid);
        if (deleteResult) {
            console.log(`Usuario eliminado exitosamente.`);
        }
        return deleteResult;
    }
    static async createProduct(req) {
        try {
            let relativePath = '';
            if (req.file) {
                relativePath = path.relative(path.join(__dirname, '../public'), req.file.path);
            }

            const newProductData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                code: req.body.code,
                stock: req.body.stock,
                thumbnail: relativePath
            };

            const newProduct = await ProductDao.create(newProductData);
            console.log(`Se creo el producto exitosamente ${JSON.stringify(newProduct)}`);
            return newProduct;
        } catch (error) {
            console.error('Error al crear producto', error);
            throw error;
        }
    }

    static async updateProduct(id, reqBody) {
        try {
            const updateResult = await ProductDao.updateById(id, reqBody);
            if (updateResult.modifiedCount === 0) {
                console.log('Producto no encontrado o no modificado');
                return null;
            }
            const updatedProduct = await ProductDao.getById(id);
            console.log(`Producto actualizado exitosamente ${JSON.stringify(updatedProduct)}`);
            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar producto', error);
            throw error;
        }
    }
    static async deleteProduct(id) {
        try {
            const deleteResult = await ProductDao.deleteById(id);
            if (deleteResult) {
                console.log('Producto eliminado exitosamente.');
            }
            return deleteResult;
        } catch (error) {
            console.error('Error al eliminar producto', error);
            throw error;
        }
    }
    static async getPaginatedProducts(page, limit, sort, query) {
        try {
            const options = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10,
                sort: sort || { createdAt: -1 } // Orden por defecto
            };

            const customQuery = query ? { title: { $regex: query, $options: 'i' } } : {};

            const paginatedProducts = await ProductDao.paginate(customQuery, options);
            console.log(`Productos paginados encontrados: ${paginatedProducts.length}`);
            return paginatedProducts;
        } catch (error) {
            console.error('Error al obtener productos paginados', error);
            throw error;
        }
    }
}