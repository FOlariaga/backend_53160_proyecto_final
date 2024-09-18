import UsersManager from "../dao/usersManager.js";

const service = new UsersManager()

class UsersController {

    async get() {
        return await service.get()
    }

    async getById(idUser) {
        return await service.getById(idUser)
    }

    async add(data) {
        try {
            return await service.add(data)
        } catch (error) {

        }
    }


    async update(filter, update, options) {
        try {
            return await service.update(filter, update, options)
        } catch (error) {

        }
    }

    async updateOne(filter, update) {
        try {
            return await service.updateOne(filter, update)
        } catch (error) {

        }
    }

    async updateDocuments(filter, update) {
        try {
            return await service.updateDocuments(filter, update)
        } catch (error) {

        }
    }

    async delete(idUser) {
        try {
            return await service.delete(idUser)
        } catch (error) {

        }
    }

    async getByEmail(email) {
        try {
            return await service.getByEmail(email)
        } catch (error) {

        }
    }
}
export default UsersController