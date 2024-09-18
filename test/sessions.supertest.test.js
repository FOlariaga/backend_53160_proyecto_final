import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const testUser = { firstName: 'Juan', lastName: 'Perez', email: 'jperez@gmail.com', password: 'abc445' , age:20};

describe('Test Integración Users', function () {

    it('POST /api/sessions/register debe registrar un nuevo usuario', async function () {
        console.log("entra");
        
        const {_body} = await requester.post('/api/sessions/register').send(testUser);

        expect(_body.error).to.be.undefined;
        expect(_body.payload).to.be.ok;
    });

    it('POST /api/sessions/register NO debe volver a registrar el mismo mail', async function () {
        const {ok} = await requester.post('/api/sessions/register').send(testUser);
        expect(ok).to.be.equals(false);
    });

    it('POST /api/sessions/login debe ingresar correctamente al usuario', async function () {
        const {_body}  = await requester.post('/api/sessions/login').send(testUser);
        
        expect(_body.error).to.be.undefined;
        expect(_body.payload).to.be.ok;
        
    });

    // it('GET /api/sessions/current debe retornar datos correctos de usuario', async function () {
    //     const { _body } = await requester.get('/api/sessions/current') // como trabajar con sessiones???;

    //     expect(_body.payload).to.have.property('name');
    //     expect(_body.payload).to.have.property('role');        
    //     expect(_body.payload).to.have.property('email').and.to.be.eql(testUser.email);
    // });
});