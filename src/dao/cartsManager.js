import cartsModel from "../models/carts.model.js";
import productModel from "../models/products.model.js"
import userModel from "../models/users.model.js"

class CartsManager {

    async get() {
        const carts = await cartsModel.find().lean();
        return carts
    }

    async getById(idCart) {
        const cart = await cartsModel.findOne({ _id: idCart })
            .populate({ path: 'products._id', model: productModel })
            .populate({ path: '_user_id', model: userModel })
            .lean()


        // cart[0].products.map((e) => {
        //     console.log(e._id._id);
        //     if (e._id._id == "6658037f1f4c4e6f66da87c9") {
        //         e.qty = e.qty - 1
        //         console.log(e);
        //     }
        // });

        return cart
    }

    async getByuser(idCart) {
        const cart = await cartsModel.findOne({ _user_id: idCart })
            .populate({ path: 'products._id', model: productModel })
            .populate({ path: '_user_id', model: userModel })
            .lean()
        return cart
    }

    async add(data) {
        const newCart = await cartsModel.create(data)
        return newCart
    }


    async delete(idCart) {
        try {
            const cart = await cartsModel.findOne(idCart).lean()

            cart.products = []

            await cartsModel.findOneAndUpdate({ _id: idCart }, cart, { new: true })

        } catch (error) {

        }
    }


    //complemento


    //eliminar un producto del carrito (cambiar el endpoint a delete)
    async deleteProductInCart(cid, pid) {
        const cart = await cartsModel.findOne({ _id: cid }).lean()

        let newCart = []

        cart.products.forEach((e) => {
            if (e._id != pid) {
                newCart.push(e)
            }
        })

        cart.products = newCart

        await cartsModel.findOneAndUpdate({ _id: cid }, cart, { new: true })

        return cart
    }

    //Aactualiza el array de products con la informacion recibida por req.body
    async updateProducts(filter, update, options) {
        const cart = await cartsModel.findOne(filter).lean()

        cart.products = update

        await cartsModel.findOneAndUpdate(filter, cart, options)

        return cart
    }

    // actualiza el qty del producto especificado
    async updateQty(filterCart, update, options, filterProduct) {
        const cart = await cartsModel.findOne(filterCart).lean()
        cart.products.forEach(e => {
            if (e._id == filterProduct) {
                e.qty = update
            }
        });

        await cartsModel.findOneAndUpdate(filter, cart, options)

        return cart
    }

    async addProductInCart(data, filter) {
        try {
            const cart = await cartsModel.findOne(filter).lean()
            let productInCart = false
            cart.products.forEach((e) => {
                if (data.product == e._id) {
                    e.qty = +data.qty
                    productInCart = true
                }
            })
            if (productInCart) {
                await cartsModel.findOneAndUpdate(filter, cart, { new: true })
                return cart
            }
            cart.products.push({_id: data.product, qty: +data.qty})
            await cartsModel.findOneAndUpdate(filter, cart, { new: true })
            return cart


        } catch (error) {
            console.log(error);
        }
    }
}

export default CartsManager