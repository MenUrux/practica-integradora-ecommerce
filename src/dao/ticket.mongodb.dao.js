import TicketModel from './models/ticket.model.js';

export default class TicketMongoDbDao {
    // Obtener tickets con criterios y opciones opcionales
    static async get(criteria = {}, opts = {}) {
        return TicketModel.find(criteria, {}, opts);
    }

    // Obtener un ticket por su ObjectId
    static async getById(oid) {
        return TicketModel.findById(oid).populate('purchaser');
    }

    // Crear un nuevo ticket
    static async create(data) {
        const ticket = new TicketModel(data);
        return ticket.save();
    }

    // Actualizar un ticket por su ObjectId
    static async updateById(oid, data) {
        const criteria = { _id: oid };
        const operation = { $set: data };
        const options = { new: true }; // Devuelve el documento modificado
        return TicketModel.findOneAndUpdate(criteria, operation, options);
    }

    // Borrar un ticket por su ObjectId
    static async deleteById(oid) {
        const criteria = { _id: oid };
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
