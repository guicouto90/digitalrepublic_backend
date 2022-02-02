const Joi = require('@hapi/joi');
const { findAllAccounts, createAccount, findByCpf, updateAccountByName, findByAccount, deleteAccount } = require('../models/accountsModel');

const accountsSchema = Joi.object({
  name: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  cpf: Joi.number().min(10000000000).max(99999999999).integer().strict().required(),
  initialDeposit: Joi.number().min(1).strict().required(),
});

const editSchema = Joi.object({
  name: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
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
};

const getAccount = async(accountNumber) => {
  const find = await findByAccount(accountNumber);
  if(!find) {
    const error = { status: 404, message: 'Account not found'}
    throw error;
  }
}

const validEdit = (body) => {
  const { name, lastName, cpf, initialDeposit } = body;
  const { error } = editSchema.validate({ name, lastName });

  if(cpf) {
    const error1 = { status: 409, message: 'Cannot edit cpf'}
    throw error1
  };

  if(initialDeposit) {
    const error1 = { status: 409, message: 'Cannot edit initialDeposit'}
    throw error1;
  };

  if(error) throw error;
};

const editAccount = async(body, accountNumber) => {
  const { name, lastName } = body;
  const fullName = name.concat(' ', lastName);
  await updateAccountByName(accountNumber, fullName);
  const editedAccount = {
    message: `Account with number ${accountNumber} edited succesfully`
  };

  return editedAccount;
};

const validDelete = async(accountNumber) => {
  const { balance } = await findByAccount(accountNumber);
  if(balance !== 0) {
    const error = { status: 422, message: 'To delete an account, the balance has to be 0'}
    throw error;
  };
  await deleteAccount(accountNumber);
  const message = { message: 'Account deleted succesfully'}
  return message;
}

module.exports = {
  getAccounts,
  validateAccountData,
  newAccount,
  verifyCpf,
  getAccount,
  validEdit,
  validDelete,
  editAccount,
}
