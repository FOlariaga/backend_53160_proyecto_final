import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';

import config from "../config.js";
import CartController from "../controller/cart.controller.js";
import ProductController from "../controller/product.controller.js"
import TicketsController from "../controller/ticket.controller.js";
import { verifyMongoDBId } from "../services/utils.js";

const controller = new CartController()
const productController = new ProductController()
const ticketsController = new TicketsController()
const router = Router()


router.get("/", async (req, res) => {
    try {
        const carts = await controller.get()

        res.status(200).send({ origin: config.SERVER, payload: carts });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null });
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await controller.getById(cid)

        res.status(200).send({ origin: config.SERVER, payload: cart })
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: null })
    }
})

router.post("/", async (req, res) => {
    try {
        const cart = await controller.add(req.body)
        res.status(200).send({ origin: config.SERVER, payload: cart });
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: null })
    }
})

//vacia el carrito completo
router.delete("/:cid", async (req, res) => {
    try {
        const cid = { _id: req.params.cid }
        await controller.delete(cid);
        console.log(`se vacio el carrito`);

        res.status(200).send({ origin: config.SERVER, payload: "carrito vacio" });
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: null })
    }
})

// eliminar el producto especifico del array
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart = await controller.deleteProductInCart(cid, pid)

        res.status(200).send({ payload: cart });
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: null })
    }
})

// actualiza el array de products con un nuevo array recibido por req.body
router.put("/:cid", async (req, res) => {
    try {
        const filter = { _id: req.params.cid };
        const update = req.body;
        const options = { new: true };
        const cart = await controller.updateProducts(filter, update, options);

        res.status(200).send({ origin: config.SERVER, payload: cart });
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: null })
    }
})

//actualiza el qty del producto especificado dentro del array de products con la cantidad especificada en req.body
router.put("/:cid/products/:pid", async (req, res) => {
    const filterCart = { _id: req.params.cid }
    const update = req.body
    const options = { new: true }
    const filterProduct = req.params.pid
    const cart = await controller.updateQty(filterCart, update, options, filterProduct)

    res.status(200).send({ origin: config.SERVER, payload: cart });
})

router.post("/addProduct", async (req, res) => {
    try {
        
        //verifico si existe un usuario logueado
        if (req.session.user) {
            const data = req.body
            // console.log(data);
            if (req.session.user.role == "premium") {
                const product = await productController.getById(data.product)
                if (req.session.user._id == product.owner) {
                    console.log("este producto pertenece al usuario premium");
                    return res.status(200).send({ origin: config.SERVER, payload: "no puedes agregar al carrito un producto que te pertenece" })
                }
            }
            //recupero el id del ususario logueado
            const filter = { _user_id: req.session.user._id }
            // console.log(filter);
            //ejecuto el manager para agregar al carrito
            const cart = await controller.addProductInCart(data, filter)

            return res.redirect("/cart")
        }




        res.redirect("/login")
    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: error });
    }
})

router.get("/:cid/purchase", async (req, res) => {
    try {
        let amount = 0
        let outOfStock = []
        let bought = []

        const cart = await controller.getById(req.params.cid)

        cart.products.forEach(async element => {
            if (element._id.stock >= element.qty) {
                element._id.stock = element._id.stock - element.qty;
                amount = amount + element._id.price * element.qty

                // console.log(element._id);
                const filter = { _id: element._id._id };
                const update = element._id;
                const options = { new: true };
                await productController.update(filter, update, options)

                bought.push(element)
            } else {
                outOfStock.push(element)
            }
        });

        const filter = { _id: req.params.cid };
        const update = outOfStock;
        const options = { new: true };
        await controller.updateProducts(filter, update, options)
        // console.log(outOfStock);
        // console.log(bought);

        //generar ticket
        const code = uuidv4()
        
        const data = {
            code: code,
            purchase_datetime: Date(),
            amount: amount,
            purchaser: req.session.user.email
        }
        const ticket = await ticketsController.add(data)

        // console.log(ticket);
        
        res.redirect(`/ticket/${ticket._id}`)

        // res.status(200).send({ origin: config.SERVER, payload: ticket })

    } catch (error) {
        res.status(500).send({ origin: config.SERVER, payload: error, })
    }
})


export default router