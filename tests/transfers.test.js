const chai = require('chai');
const sinon = require('sinon');
const chaiHTTP = require('chai-http');

chai.use(chaiHTTP);

const { expect } = chai;
const { MongoClient, ObjectId } = require('mongodb');
const server = require('../index');

const { getConnection } = require('./connectionMock');

describe('POST /transfers/:accountNumber', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When the transfer is complete', () => {
    let response;
    before(async ()=> {
      const accountsCollection = connectionMock.db('DigitalRepublic').collection('accounts');
      await accountsCollection.insertOne({
        accountNumber: 12356,
        fullName: 'Roberto da Silva',
        cpf: 12345678910,
        balance: 500
      });

      await accountsCollection.insertOne({
        accountNumber: 123456,
        fullName: 'Roger de Ssouza',
        cpf: 12345678910,
        balance: 500
      });

      response = await chai.request(server)
        .post('/transfers/123456')
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

    it('return a property "TransferId", "Message" in the body', () => {
      expect(response.body).to.have.property('TransferId');
      expect(response.body).to.have.property('Message')
    });

    it('return message in the field "Message": "Transfer successfully conclued. The value was transferred from <accountNumber> account number to <accountNumber> account number"', () => {
      expect(response.body.Message).to.be.equals(`Transfer successfully conclued. The value was transferred from ${123456} account number to ${12356} account number`)
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
        .post('/transfers/12356')
        .send({
          destinationAccount: 1235600,
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

  describe('When the source account doesnt exists', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/transfers/56565656')
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

    it('return message in the field "message": "\"sourceAccount\" account doens`t exist."', () => {
      expect(response.body.message).to.be.equals("\"sourceAccount\" account doens`t exist.")
    })
  });

  describe('When the destination account is not a number type', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/transfers/12356')
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
        .post('/transfers/12356')
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
        .post('/transfers/12356')
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

  describe('When the value is higher than the balance in sourceAccount', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/transfers/12356')
        .send({
          destinationAccount: 123456,
          value: 50000
        })
    });

    it('Return status 401', () => {
      expect(response).to.have.status(401);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message"in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('return message in the field "message": "Not enough balance to conclude the transfer."', () => {
      expect(response.body.message).to.be.equals("Not enough balance to conclude the transfer.")
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

  describe('When the value field is less than 1', () => {
    let response;
    before(async ()=> {
      response = await chai.request(server)
        .post('/transfers/12356')
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

describe('GET /transfers', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Get all transfers', () => {
    let response;
    before(async() => {
      const transfersCollection = await connectionMock.db('DigitalRepublic').collection('transfers');
      await transfersCollection.insertOne({
        _id: "61f91f84ae117e18eb6ff2d8",
        sourceAccount: 85006,
        destinationAccount: 31588,
        value: 500
      });
      response = await chai.request(server).get('/transfers')
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array in the body', () => {
      expect(response.body).to.be.an('array');
    });

    it('return a property "_id", "sourceAccount", "destinationAccount", "value" in the body', () => {
      expect(response.body[0]).to.have.property('_id');
      expect(response.body[0]).to.have.property('sourceAccount')
      expect(response.body[0]).to.have.property('destinationAccount')
      expect(response.body[0]).to.have.property('value')
    });
  })
});

describe('GET /transfers/receipts/:accountNumber', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Get all transfers for an especific accountNumber', () => {
    let response;
    before(async() => {
      const accountsCollection = connectionMock.db('DigitalRepublic').collection('accounts');
      await accountsCollection.insertOne({
        accountNumber: 85006,
        fullName: 'Roger Guedes',
        cpf: 12345678910,
        balance: 500
      })
      const transfersCollection = await connectionMock.db('DigitalRepublic').collection('transfers');
      await transfersCollection.insertOne({
        _id: "61f91f84ae117e18eb6gg2d8",
        sourceAccount: 85006,
        destinationAccount: 31588,
        value: 500
      });

      await transfersCollection.insertOne({
        _id: "61f91f84ae117e18eb6hh2d8",
        sourceAccount: 15500,
        destinationAccount: 85006,
        value: 15500
      });

      response = await chai.request(server).get('/transfers/receipts/85006')
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array in the body', () => {
      expect(response.body).to.be.an('array');
    });

    it('return property "_id", "sourceAccount", "destinationAccount", "value" in the body', () => {
      expect(response.body[0]).to.have.property('_id');
      expect(response.body[0]).to.have.property('sourceAccount')
      expect(response.body[0]).to.have.property('destinationAccount')
      expect(response.body[0]).to.have.property('value')
    });
  });

  describe('When the accountNumber doesnt exists', () => {
    let response;
    before(async() => {
      response = await chai.request(server).get('/transfers/receipts/850060')
    });

    it('Return status 404', () => {
      expect(response).to.have.status(404);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" has the content: "Account not found"', () => {
      expect(response.body.message).to.be.equals('Account not found');
    });
  })
});

describe('GET /transfers/:id', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('Get an especific transfers by id', () => {
    let response;
    before(async() => {
      const transfersCollection = await connectionMock.db('DigitalRepublic').collection('transfers');
      const { insertedId } = await transfersCollection.insertOne({
        sourceAccount: 85006,
        destinationAccount: 31588,
        value: 500
      });
      response = await chai.request(server).get(`/transfers/${insertedId}`)
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "_id", "sourceAccount", "destinationAccount", "value" in the body', () => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('sourceAccount')
      expect(response.body).to.have.property('destinationAccount')
      expect(response.body).to.have.property('value')
    });
  });

  describe('When is an invalid ID', () => {
    let response;
    before(async() => {
      response = await chai.request(server).get('/transfers/61f91f84ae117e18eb6ff2d80')
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

    it('Property "message" has the content: "Invalid transfer ID"', () => {
      expect(response.body.message).to.be.equals('Invalid transfer ID');
    });
  });

  describe('When the transfer is not found', () => {
    let response;
    before(async() => {
      response = await chai.request(server).get('/transfers/61f91f84ae117e18eb6ff2d9')
    });

    it('Return status 404', () => {
      expect(response).to.have.status(404);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" has the content: "Transfer not found"', () => {
      expect(response.body.message).to.be.equals('Transfer not found');
    });
  })
});