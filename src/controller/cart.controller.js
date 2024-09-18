import CartsManager from "../dao/cartsManager.js";

const service = new CartsManager()
class CartsController {
    constructor(){

    }

    async get() {
        try {
            return await service.get()
        } catch (error) {
            console.log(error)
        }
    }

    async getById(idCart) {
        try {
            return await service.getById(idCart)
        } catch (error) {
            console.log(error)
        }
    }

    async getByuser(idCart) {
        try {
            return await service.getByuser(idCart)
        } catch (error) {
            console.log(error)
        }
    }

    async add(idUser) {
        try {
            const data = { _user_id: idUser, products: [] }
            return await service.add(data)
        } catch (error) {
            console.log(error)
        }
    }


    async delete(idCart) {
        try {
            return await service.delete(idCart)
        } catch (error) {

        }
    }

    async deleteProductInCart(cid, pid) {
        return await service.deleteProductInCart(cid,pid)
    }

    async updateProducts(filter, update, options) {
        try {
            return await service.updateProducts(filter, update, options)
        } catch (error) {
            console.log(error)
        }
    }

    async updateQty(filterCart, update, options, filterProduct) {
        return await service.updateQty(filterCart, update, options, filterProduct)
    }

    async addProductInCart(data, filter) {
        try {
            return await service.addProductInCart(data, filter)
        } catch (error) {
            console.log(error);
        }
    }
}

export default CartsController