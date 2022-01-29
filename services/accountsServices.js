const Joi = require('@hapi/joi');
const { findAllAccounts, createAccount, findByCpf } = require('../models/accountsModel');

const accountsSchema = Joi.object({
  name: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  cpf: Joi.number().min(10000000000).max(99999999999).integer().strict().required(),
  initialDeposit: Joi.number().min(1).strict().required(),
});

const validateAccountData = (name, lastName, cpf, initialDeposit) => {
  const { error } = accountsSchema.validate({ name, lastName, cpf, initialDeposit });

  if(cpf < 10000000000 || cpf > 99999999999) {
    const error1 = { status: 422, message: 'Invalid cpf number' };
    throw error1
  }

  if(error) throw error;
};

const getAccounts = async() => {
  const result = await findAllAccounts();

  return result;
};

const verifyCpf = async(cpf) => {
  const result = await findByCpf(cpf);
  if(result) {
    const error = { status: 409, message: 'CPF already registered with another account' };
    throw error;
  }
};

const newAccount = async(name, lastName, cpf, initialDeposit) => {
  const fullName = name.concat(' ', lastName);
  const accountNumber = Math.floor(Math.random() * 100000);
  const accountId = await createAccount(fullName, cpf, accountNumber, initialDeposit);
  const account = {
    accountNumber,
    _id: accountId,
    fullName,
    cpf,
    balance: initialDeposit,
  };

  return account;
}

module.exports = {
  getAccounts,
  validateAccountData,
  newAccount,
  verifyCpf,
}
