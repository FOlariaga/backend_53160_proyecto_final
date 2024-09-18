import { Router} from "express";
import ProductController from "../controller/product.controller.js";
import CartController from "../controller/cart.controller.js";
import UsersController from "../controller/user.controller.js";
import TicketsController from "../controller/ticket.controller.js";
import { authorizationRole, verifyMongoDBId, verifyToken } from "../services/utils.js";
import generateFakeProducts from "../services/mocking.faker.js";
import errorsHandler from "../services/errors.handler.js";

const productController = new ProductController()
const cartController = new CartController()
const UserController = new UsersController()
const ticketController = new TicketsController()
const router = Router()

router.get("/products", async (req, res) => {
    try {
        const products = await productController.get({limit: req.query.limit || 10, page: req.query.page || 1, query : req.query.query || "" });
    
        res.render("products", {data: Object.assign(products,{category : req.query.query || ""})})
    } catch (error) {
    }
})

router.get("/product/:pid", async (req, res) => {
    const pid = req.params.pid
    const product = await productController.getById(pid)
    let deleteAuth = false  
    console.log(req.session.user);
    
    
    if (req.session.user) {
        if(req.session.user.role == "admin" || req.session.user.role == "premium") {
            deleteAuth = true}
    }

    res.render("detail", { data: product, deleteAuth: deleteAuth})
})


router.get("/chat", authorizationRole(["user"]), async (req, res) => {
    try {
        res.render("chat", {})
    } catch (error) {
    } 
})

router.get("/cart", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login")
    }

    const cart = await cartController.getByuser(req.session.user._id)
    res.render("cart", {data: cart})
})

router.get("/cart/:cid", async (req, res) => {
    const cid = req.params.cid
    const cart = await cartController.getById(cid)
    console.log(cart);
    res.render("cart", {data: cart})
})

router.get("/login", async (req, res) => {
    if(req.session.user){
        return res.redirect("/products")
    }
    res.render("login", {})
})

router.get("/register", async (req, res) => {
    res.render("register", {})
})

router.get("/profile", async (req, res) => {

    if(!req.session.user){
        return res.redirect("/login")
    }
    res.render("profile", {user: req.session.user})
})

router.get("/mockingProducts/:qty", async (req, res) => {
    if (!parseInt(req.params.qty)) {
        return res.status(500).send({status: 'fail', payload: "cantidad no valida: ingrese un numero"})
    };
    const data = generateFakeProducts(parseInt(req.params.qty))
    return res.status(200).send({status: 'OK', payload: data })
})

router.get("/loggerTest", async (req, res) => {
    req.logger.debug(`${new Date().toDateString()} ${req.method} ${req.url}`)
    req.logger.http(`${new Date().toDateString()} ${req.method} ${req.url}`)
    req.logger.info(`${new Date().toDateString()} ${req.method} ${req.url}`)
    req.logger.warning(`${new Date().toDateString()} ${req.method} ${req.url}`)
    req.logger.error(`${new Date().toDateString()} ${req.method} ${req.url}`)
    req.logger.fatal(`${new Date().toDateString()} ${req.method} ${req.url}`)

    res.send("test finalizado, verifique consola y/o archivo errors.log en el entorno de produccion")
})

router.get("/restore", async (req,res) => {
    if(req.session.user){
        return res.redirect("/profile")
    }
    res.render("restore", {})
})

router.get("/restorePassword", verifyToken, async (req,res) => {
    res.render("restorePassword", {data: req.token})
})

router.get("/documents", async (req, res) => {

    if(!req.session.user){
        return res.redirect("/login")
    }
    res.render("documents", {user: req.session.user})
})

router.get("/admin", authorizationRole(["admin"]), async (req, res) => {
    const users = await UserController.get()

    res.render("admin", {data: users})
})

router.get("/managerUser/:uid", authorizationRole(["admin"]), async (req, res) => {
    const user = await UserController.getById(req.params.uid)

    res.render("managerUser", {user: user[0]})
})

router.get("/ticket/:tid", async (req, res) => {
    const ticket = await ticketController.getById(req.params.tid)

    res.render("purchase", {data: ticket[0]})
})


export default router