const chai = require('chai');
const sinon = require('sinon');
const chaiHTTP = require('chai-http');

chai.use(chaiHTTP);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const server = require('../index');

const { getConnection } = require('./connectionMock');

describe('POST /deposits', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When the deposit is complete', () => {
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
        .post('/deposits')
        .send({
          destinationAccount: 12356,
          value: 500,
        })
    });

    it('Return status 201', () => {
      expect(response).to.have.status(201);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "DepositId", "Message" in the body', () => {
      expect(response.body).to.have.property('DepositId');
      expect(response.body).to.have.property('Message')
    });

    it('return message in the field "Message": "Deposit complete."', () => {
      expect(response.body.Message).to.be.equals('Deposit complete.')
    })
  });

  describe('When the destination account doesnt exists', () => {
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
        .post('/deposits')
        .send({
          destinationAccount: 123560,
          value: 500,
        })
    });

    it('Return status 409', () => {
      expect(response).to.have.status(409);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": ""\"destinationAccount\" account doens`t exist.""', () => {
      expect(response.body.message).to.be.equals("\"destinationAccount\" account doens`t exist.")
    })
  });

  describe('When the destination account doesnt exists', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/deposits')
        .send({
          destinationAccount: 123560,
          value: 500,
        })
    });

    it('Return status 409', () => {
      expect(response).to.have.status(409);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": "\"destinationAccount\" account doens`t exist."', () => {
      expect(response.body.message).to.be.equals("\"destinationAccount\" account doens`t exist.")
    })
  });

  describe('When the destination account is not a number type', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/deposits')
        .send({
          destinationAccount: "123560",
          value: 500,
        })
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": "\"destinationAccount\" must be a number"', () => {
      expect(response.body.message).to.be.equals("\"destinationAccount\" must be a number")
    })
  });

  describe('When the destinationAccount field is empty', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/deposits')
        .send({
          value: 500,
        })
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": "\"destinationAccount\" is required"', () => {
      expect(response.body.message).to.be.equals("\"destinationAccount\" is required")
    })
  });

  describe('When the value field is not a number type', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/deposits')
        .send({
          destinationAccount: 123456,
          value: "500"
        })
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": "\"value\" must be a number"', () => {
      expect(response.body.message).to.be.equals("\"value\" must be a number")
    })
  });

  describe('When the value field is empty', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/deposits')
        .send({
          destinationAccount: 123456
        })
    });

    it('Return status 422', () => {
      expect(response).to.have.status(422);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": "\"value\" is required"', () => {
      expect(response.body.message).to.be.equals("\"value\" is required")
    })
  });

  describe('When the value field is more than 2000', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/deposits')
        .send({
          destinationAccount: 123456,
          value: 2001
        })
    });

    it('Return status 405', () => {
      expect(response).to.have.status(405);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": "Transfer value not allowed. Maximus allowed is 2000"', () => {
      expect(response.body.message).to.be.equals('Transfer value not allowed. Maximus allowed is 2000')
    })
  });

  describe('When the value field is less than 1', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/deposits')
        .send({
          destinationAccount: 123456,
          value: 0
        })
    });

    it('Return status 405', () => {
      expect(response).to.have.status(405);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": "Transfer value not allowed. Minimum allowed is 1"', () => {
      expect(response.body.message).to.be.equals('Transfer value not allowed. Minimum allowed is 1')
    })
  });
});

describe('GET /deposits', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Get all deposits', () => {
    let response;
    before(async() => {
      const depositCollection = await connectionMock.db('DigitalRepublic').collection('deposits');
      await depositCollection.insertOne({
        _id: "61f921384364461337ddd674",
        destinationAccount: 31588,
        value: 2000
      });
      response = await chai.request(server).get('/deposits')
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array in the body', () => {
      expect(response.body).to.be.an('array');
    });

    it('return a property "_id", "destinationAccount", "value" in the body', () => {
      expect(response.body[0]).to.have.property('_id');
      expect(response.body[0]).to.have.property('destinationAccount')
      expect(response.body[0]).to.have.property('value')
    });
  })
});

describe('GET /deposits/:accountNumber', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When account number doesnt exists', () => {
    let response;
    before(async() => {
      response = await chai.request(server).get('/deposits/5555')
    });

    it('Return status 409', () => {
      expect(response).to.have.status(409);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": ""\"destinationAccount\" account doens`t exist.""', () => {
      expect(response.body.message).to.be.equals("\"destinationAccount\" account doens`t exist.")
    })
  })

  describe('Get all deposits made for an especific account', () => {
    let response;
    before(async() => {
      const accountsCollection = connectionMock.db('DigitalRepublic').collection('accounts');
      await accountsCollection.insertOne({
        accountNumber: 31588,
        fullName: 'Roberto da Silva',
        cpf: 12345678910,
        balance: 500
      });

      const depositCollection = await connectionMock.db('DigitalRepublic').collection('deposits');
      await depositCollection.insertOne({
        _id: "61f921384364461337fff674",
        destinationAccount: 31588,
        value: 2000
      });
      response = await chai.request(server).get('/deposits')
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array in the body', () => {
      expect(response.body).to.be.an('array');
    });

    it('return a property "_id", "destinationAccount", "value" in the body', () => {
      expect(response.body[0]).to.have.property('_id');
      expect(response.body[0]).to.have.property('destinationAccount')
      expect(response.body[0]).to.have.property('value')
    });
  })
});