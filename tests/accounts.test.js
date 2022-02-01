const chai = require('chai');
const sinon = require('sinon');
const chaiHTTP = require('chai-http');

chai.use(chaiHTTP);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const server = require('../index');

const { getConnection } = require('./connectionMock');

describe('POST /accounts', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When the field "name" is not a string', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 1235,
          lastName: 'da Silva',
          cpf: 12345678910,
          initialDeposit: 50
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"name\" must be a string"', () => {
      expect(response.body.message).to.be.equals("\"name\" must be a string");
    });
  });

  describe('When the field "name" is empty', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          lastName: 'da Silva',
          cpf: 12345678910,
          initialDeposit: 50
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"name\" is required"', () => {
      expect(response.body.message).to.be.equals("\"name\" is required");
    });
  });

  describe('When the field "lastName" is not a string type', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          lastName: 12356,
          cpf: 12345678910,
          initialDeposit: 50
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"lastName\" must be a string"', () => {
      expect(response.body.message).to.be.equals("\"lastName\" must be a string");
    });
  });

  describe('When the field "lastName" is empty', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          cpf: 12345678910,
          initialDeposit: 50
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"lastName\" is required"', () => {
      expect(response.body.message).to.be.equals("\"lastName\" is required");
    });
  });

  describe('When the field "cpf" is not a number type', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          lastName: 'da Silva',
          cpf: '12345678910',
          initialDeposit: 50
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"cpf\" must be a number"', () => {
      expect(response.body.message).to.be.equals("\"cpf\" must be a number");
    });
  });

  describe('When the field "cpf" has already been registered for another account', () => {
    let response;
    before(async ()=> {
      const accountsCollection = connectionMock.db('DigitalRepublic').collection('accounts');
      await accountsCollection.insertOne({
        name: 'Roberto',
        lastName: 'da Silva',
        cpf: 12345678910,
        initialDeposit: 500
      });

      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          lastName: 'da Silva',
          cpf: 12345678910,
          initialDeposit: 50
        });
    });

    it('Return status 409', () => {
      expect(response).to.have.status(409);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "CPF already registered with another account"', () => {
      expect(response.body.message).to.be.equals("CPF already registered with another account");
    });
  });

  describe('When the field "cpf" doenst have 11 numbers length', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          lastName: 'da Silva',
          cpf: 123456789100,
          initialDeposit: 50
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "Invalid cpf number"', () => {
      expect(response.body.message).to.be.equals("Invalid cpf number");
    });
  });

  describe('When the field "cpf" is empty', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          lastName: 'da Silva',
          initialDeposit: 50
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"cpf\" is required"', () => {
      expect(response.body.message).to.be.equals("\"cpf\" is required");
    });
  });

  describe('When the field "initialDeposit" is not a number type', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          lastName: 'da Silva',
          cpf: 12345678910,
          initialDeposit: '50'
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"initialDeposit\" must be a number"', () => {
      expect(response.body.message).to.be.equals("\"initialDeposit\" must be a number");
    });
  });

  describe('When the field "initialDeposit" is empty', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          lastName: 'da Silva',
          cpf: 12345678910,
        });
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"initialDeposit\" is required"', () => {
      expect(response.body.message).to.be.equals("\"initialDeposit\" is required");
    });
  });

  describe('When account is registered', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/accounts')
        .send({
          name: 'Roberto',
          lastName: 'da Silva',
          cpf: 12345678911,
          initialDeposit: 50,
        });
    });

    it('Return status 201', () => {
      expect(response).to.have.status(201);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "accountNumber", "_id", "fullName", "cpf" and "balance" in the body', () => {
      expect(response.body).to.have.property('accountNumber');
      expect(response.body).to.have.property('_id')
      expect(response.body).to.have.property('fullName')
      expect(response.body).to.have.property('cpf')
      expect(response.body).to.have.property('balance')
    });
  });
});

describe('GET /accounts', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Get all the registered accounts', () => {
    let response;
    before(async ()=> {
      const accountsCollection = connectionMock.db('DigitalRepublic').collection('accounts');
      await accountsCollection.insertOne({
        accountNumber: 12356,
        fullName: 'Roberto da Silva',
        cpf: 12345678910,
        balance: 500
      });
      response = await chai.request(server)
        .get('/accounts')
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array in the body', () => {
      expect(response.body).to.be.an('array');
    });

    it('return a property "accountNumber", "_id", "fullName", "cpf" and "balance" in the body', () => {
      expect(response.body[2]).to.have.property('accountNumber');
      expect(response.body[2]).to.have.property('_id')
      expect(response.body[2]).to.have.property('fullName')
      expect(response.body[2]).to.have.property('cpf')
      expect(response.body[2]).to.have.property('balance')
    });
  });
});