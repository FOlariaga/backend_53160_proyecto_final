import usersModel from "../models/users.model.js";

class UsersManager {

    async get() {
        const users = await usersModel.find().lean()
        return users
    }

    async getById(idUser) {
        const user = await usersModel.find({ _id: idUser }).lean()
        return user
    }

    async add(data) {
        const user = await usersModel.findOne({ email: data.email }).lean()

        if (user) {
            return { exist: true, payload: `${data.email} ya esta registrado` }
        }

        const newUser = await usersModel.create(data)
        return { exist: false, payload: newUser }
    }


    async update(filter, update, options) {
        const user = await usersModel.findOneAndUpdate(filter, update, options);
        return user
    }

    async updateOne(filter, update) {
        const user = await usersModel.updateOne(filter, { $set: update });
        return user
    }

    async updateDocuments(filter, data) {

        const user = await usersModel.find(filter).lean()
        let documents = []
        let exist = false

        if (!user[0].documents) {
            documents.push(data)
        } else {
            
            
            for (let i = 0; i <= user[0].documents.length; i++) {
                
                if (user[0].documents.length == i) {
                    if(!exist) {
                        documents.push(data)
                    }
                } else {
                    if (user[0].documents[i].name == data.name) {
                        documents.push(data)
                        exist = true
                    }else{
                        documents.push(user[0].documents[i])
                    }
                }
            }
        }
            
        const update = { documents: documents }
        await this.updateOne(filter, update)
    }

    async delete(idUser) {
        try {
            const user = await usersModel.findOneAndDelete(idUser);
            // console.log(user);
            return user
        } catch (error) {

        }
    }

    async getByEmail(email) {
        const user = await usersModel.findOne({ email: email }).lean()
        // console.log(user)
        return user
    }
}
export default UsersManager