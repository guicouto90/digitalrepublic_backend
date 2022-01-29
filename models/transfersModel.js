const connection = require('./connection');

const listAllTransfers = async() => {
  const connect = await connection();
  const query = await connect.collection('transfers').find({}).toArray();

  return query;
};

const registerTransfers = async(from, to, value) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('transfers').insertOne({ from, to, value });

  return insertedId;
};

module.exports = {
  listAllTransfers,
  registerTransfers,
}