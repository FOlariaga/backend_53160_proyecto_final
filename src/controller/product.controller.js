import ProductsManager from "../dao/productsManager.js";
// import ProductsManager from "../services/dao.factory.js";

const service = new ProductsManager()

class ProductController {
    constructor() {
    }

    async get({ limit, page, query }) {
        try {
            return await service.get(limit, page, query)
        } catch (error) {

        }
    }

    async getById(idProduct) {
        try {
            return await service.getById(idProduct)
        } catch (error) {

        }
    }

    async add(data) {
        try {
            console.log(data);
            
            return await service.add(data)
        } catch (error) {
            console.log(error);
            
        }
    }


    async update(filter, update, options) {
        try {
            return await service.update(filter, update, options)
        } catch (error) {

        }

    }

    async delete(idProduct) {
        try {
            await service.delete(idProduct)
        } catch (error) {

        }

    }

}

export default ProductController