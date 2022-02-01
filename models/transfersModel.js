const { ObjectId } = require('mongodb');
const connection = require('./connection');

const findAllTransfers = async() => {
  const connect = await connection();
  const query = await connect.collection('transfers').find({}).toArray();

  return query;
};

const registerTransfers = async(sourceAccount, destinationAccount, value) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('transfers').insertOne({ sourceAccount, destinationAccount, value });

  return insertedId;
};

const findTransfersByAccount = async(accountNumber) => {
  const connect = await connection();
  const query = await connect.collection('transfers').find({
    $or: [
      { soucerAccount: accountNumber },
      { destinationAccount: accountNumber}
    ]
  }).toArray();

  return query;
};

const findByTransferId = async(id) => {
  const connect = await connection();
  const query = await connect.collection('transfers').findOne({ _id: ObjectId(id)});

  return query;
}

module.exports = {
  findAllTransfers,
  registerTransfers,
  findTransfersByAccount,
  findByTransferId,
}