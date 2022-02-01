const connection = require('./connection');

const registerDeposit = async (destinationAccount, value) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('deposits').insertOne({ destinationAccount, value });

  return insertedId;
};

const findAllDeposit = async () => {
  const connect = await connection();
  const query = await connect.collection('deposits').find({}).toArray();

  return query;
};

const findDepositByAccountNum = async(destinationAccount) => {
  const connect = await connection();
  const query = await connect.collection('deposits').find({ destinationAccount }).toArray();

  return query;
};

module.exports = {
  registerDeposit,
  findAllDeposit,
  findDepositByAccountNum,
}