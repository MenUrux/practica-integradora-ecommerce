import TicketModel from './models/ticket.model.js';

export default class TicketMongoDbDao {
    // Obtener tickets con criterios y opciones opcionales
    static async get(criteria = {}, opts = {}) {
        return TicketModel.find(criteria, {}, opts);
    }

    static async getById(oid) {
        try {
            return await TicketModel.findById(oid)
                .populate('purchaser')
                .populate({
                    path: 'products.product',
                    model: 'Product'
                });
        } catch (error) {
            console.error("Error fetching ticket with ID:", oid, error);
            throw error;
        }
    }

    // Crear un nuevo ticket
    static async create(data) {
        const ticket = new TicketModel(data);
        return ticket.save();
    }

    // Actualizar un ticket por su ObjectId
    static async updateById(tid, data) {
        const criteria = { _id: tid };
        const operation = { $set: data };
        const options = { new: true }; // Devuelve el documento modificado
        return TicketModel.findOneAndUpdate(criteria, operation, options);
    }

    // Borrar un ticket por su ObjectId
    static async deleteById(tid) {
        const criteria = { _id: tid };
        return TicketModel.deleteOne(criteria);
    }

    static async createTicket(purchaseDetails) {
        const ticket = new TicketModel({
            purchaser: purchaseDetails.userId,
            amount: purchaseDetails.amount,
            total: purchaseDetails.total,
        });

        await ticket.save();
        return ticket;
    }
}
