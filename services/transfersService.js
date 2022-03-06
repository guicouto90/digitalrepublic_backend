const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const { findByAccount, updateBalance } = require('../models/accountsModel');
const { registerTransfers, findAllTransfers, findByTransferId, findTransfersByAccount } = require('../models/transfersModel');

const transferSchema = Joi.object({
  sourceAccount: Joi.number().strict().required(),
  destinationAccount: Joi.number().strict().required(),
  value: Joi.number().min(1).strict().required(),
});

const getAllTransfers = async() => {
  const result = await findAllTransfers();

  return result;
}

const validateTransferSchema = (sourceAccount, destinationAccount, value) => {
  const { error } = transferSchema.validate({ sourceAccount, destinationAccount, value });

  if(value < 1) {
    const error1 = { status: 405, message: 'Transfer value not allowed. Minimum allowed is 1' };
    throw error1;
  }

  if(error) throw error;
};

const validateTransfer = async(sourceAccount, destinationAccount, value) => {
  const fromAccount = await findByAccount(sourceAccount);
  if(!fromAccount) {
    const error = { status: 409, message: '"sourceAccount" account doens`t exist.' };
    throw error; 
  }

  const toAccount = await findByAccount(destinationAccount);
  if(!toAccount) {
    const error = { status: 409, message: '"destinationAccount" account doens`t exist.' };
    throw error; 
  }

  if(fromAccount.accountNumber === toAccount.accountNumber) {
    const error = { status: 401, message: '"sourceAccount" can not be the same of "destinationAccount".' };
    throw error; 
  }

  if(fromAccount.balance < value) {
    const error = { status: 401, message: 'Not enough balance to conclude the transfer.' };
    throw error;
  }
};

const transferMoney = async(sourceAccount, destinationAccount, value) => {
  validateTransferSchema(sourceAccount, destinationAccount, value);
  await validateTransfer(sourceAccount, destinationAccount, value);
  const fromBalance = await findByAccount(sourceAccount);
  const newBalanceFrom = fromBalance.balance - value;
  await updateBalance(sourceAccount, newBalanceFrom);

  const toBalance = await findByAccount(destinationAccount);
  const newBalanceTo = toBalance.balance + value;
  await updateBalance(destinationAccount, newBalanceTo);

  const transferId = await registerTransfers(sourceAccount, destinationAccount, value);

  const transfer = {
    TransferId: transferId,
    Message: `Transfer successfully conclued. The value was transferred from ${sourceAccount} account number to ${destinationAccount} account number`,
  };

  return transfer;
};

const validateId = (id) => {
  const valid = ObjectId.isValid(id);

  if(valid === false) {
    const error = { status: 422, message: 'Invalid transfer ID' };
    throw error;
  }
}

const getTransferById = async(id) => {
  validateId(id);
  const result = await findByTransferId(id);
  if(!result) {
    const error = { status: 404, message: 'Transfer not found' };
    throw error;
  }

  return result;
};

const getTransferByAccountNum = async(accountNumber) => {
  const account = await findByAccount(accountNumber);
  if(!account) {
    const error = { status: 404, message: 'Account not found' };
    throw error;
  }

  const result = await findTransfersByAccount(accountNumber);

  return result;
}

module.exports = {
  validateTransferSchema,
  validateTransfer,
  transferMoney,
  getAllTransfers,
  validateId,
  getTransferById,
  getTransferByAccountNum
}

