const connection = require('./connection');

const findAllAccounts = async() => {
  const connect = await connection();
  const query = await connect.collection('accounts').find({}).toArray();

  return query;
};

const createAccount = async(name, cpf, accountNumber, balance) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('accounts').insertOne({ name, cpf, accountNumber, balance });

  return insertedId;
};

const findByCpf = async(cpf) => {
  const connect = await connection();
  const query = await connect.collection('accounts').findOne({ cpf });

  return query;
};

const findByAccount = async(accountNumber) => {
  const connect = await connection();
  const query = await connect.collection('accounts').findOne({ accountNumber });

  return query;
};

const updateBalance = async(accountNumber, balance) => {
  const connect = await connection();
  await connect.collection('accounts').updateOne(
    { accountNumber },
    { $set: { balance } }
  )
};

module.exports = {
  findAllAccounts,
  createAccount,
  findByCpf,
  findByAccount,
  updateBalance,
}