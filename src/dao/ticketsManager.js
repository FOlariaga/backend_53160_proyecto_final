import ticketModel from "../models/ticket.model.js";

class TicketsManager {
    async add(data) {
        const ticket = await ticketModel.create(data)
        return ticket
    }

    async getById(idticket) {
        const ticket = await ticketModel.find({ _id: idticket }).lean()
        return ticket
    }
}

export default TicketsManager
