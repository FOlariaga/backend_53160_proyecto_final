import chai from 'chai';
import supertest from 'supertest';
import ProductManager from '../src/dao/productsManager.js';


const dao = new ProductManager 
const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const testProduct = {title: "productTest", price: 100, stock: 10, code: "a1b2c3", category: "test"};
const productUpdate = {title: "producttest2", description: "producto modificado", price: 100, stock: 10, code: "a1b2c3", category: "test"};

describe('Test Integración products', function () {

    it('POST /api/products debe registrar un nuevo producto', async function () {
        const {_body, statusCode} = await requester.post('/api/products').send(testProduct);
        testProduct._id = _body.payload._id

        expect(statusCode).to.be.equals(201)
        expect(_body.error).to.be.undefined;
        expect(_body.payload).to.be.ok;
    });

    it('GET /api/products Debe devolver un array de productos', async function () {
        const {_body,statusCode} = await requester.get('/api/products');
        
        expect(statusCode).to.be.equals(200)
        expect(_body.payload).to.be.ok;
        // console.log(_body.payload.docs);
    });

    it('getBy() debe retornar un objeto coincidente con el criterio indicado', async function () {
        console.log(testProduct._id);
        
        const {_body,statusCode} = await requester.get(`/api/products/${testProduct._id}`)
        
        expect(statusCode).to.be.equals(200)
        expect(_body).to.be.an('object');
        expect(_body.payload._id).to.be.not.null;
        expect(_body.payload.title).to.be.equals(testProduct.title);
    });

    it('update() debe retornar un objeto con los datos modificados', async function () {
        const {_body,statusCode} = await requester.put(`/api/products/${testProduct._id}`).send(productUpdate)
        
        expect(statusCode).to.be.equals(200)
        expect(_body).to.be.an('object');
        expect(_body.payload._id).to.be.not.null;
        expect(_body.payload.title).to.be.equals(productUpdate.title);
    });
});