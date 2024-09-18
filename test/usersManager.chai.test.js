import chai from 'chai';
// import * as chai from'chai';
import mongoose from 'mongoose';
import UsersManager from '../src/dao/usersManager.js';

const connection = await mongoose.connect('mongodb+srv://FOlariaga:QNxt9FsbrAm0XFHz@clustercoder53160fo.hnz3aid.mongodb.net/ecommerce');
const dao = new UsersManager();
const expect = chai.expect;
const testUser = { firstName: 'Juan', lastName: 'Perez', email: 'jperez@gmail.com', password: 'abc445', age:20};
const userUpdate = { firstName: 'Joaco', lastName: 'Perez', email: 'jperez@gmail.com', password: 'abc445', age:21};

describe("Test DAO User", function() {
    before(function () {})
    beforeEach(function () {})
    after(function () {})
    afterEach(function () {})

    it("get() debe devolver un array de usuarios", async function () {
        const result = await dao.get()
        expect(result).to.be.an("array")
    })

    it('add() debe retornar un objeto con los datos del nuevo usuario', async function () {
        const result = await dao.add(testUser);

        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
    });

    it('getByEmail() debe retornar un objeto coincidente con el criterio indicado', async function () {
        const result = await dao.getByEmail(testUser.email);
        testUser._id = result._id;

        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
        expect(result.email).to.be.equal(testUser.email);
    });

    it('update() debe retornar un objeto con los datos modificados', async function () {
        const result = await dao.update({_id:testUser._id}, userUpdate, {new: true});

        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
        expect(result.firstName).to.be.equal(userUpdate.firstName);
    });

    it('delete() debe borrar definitivamente el documento indicado', async function () {
        const result = await dao.delete(testUser._id);

        expect(result).to.be.an('object');
        expect(result._id).to.be.deep.equal(testUser._id);
    });
})