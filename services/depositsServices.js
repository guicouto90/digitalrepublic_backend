const Joi = require('@hapi/joi');
const { findByAccount, updateBalance } = require('../models/accountsModel');
const { registerDeposit, findAllDeposit, findDepositByAccountNum } = require('../models/depositModel');

const depositSchema = Joi.object({
  destinationAccount: Joi.number().strict().required(),
  value: Joi.number().min(1).max(2000).strict().required(),
});

const validateDepositSchema = (destinationAccount, value) => {
  const { error } = depositSchema.validate({ destinationAccount, value });

  if(value > 2000) {
    const error1 = { status: 405, message: 'Transfer value not allowed. Maximus allowed is 2000' };
    throw error1;
  }

  if(value < 1) {
    const error1 = { status: 405, message: 'Transfer value not allowed. Minimum allowed is 1' };
    throw error1;
  }

  if(error) throw error;
};

const validateAccount = async(destinationAccount) => {
  const valid = await findByAccount(destinationAccount);

  if(!valid) {
    const error = { status: 409, message: '"destinationAccount" account doens`t exist.' };
    throw error; 
  }
};

const depositMoney = async(destinationAccount, value) => {
  validateDepositSchema(destinationAccount, value);
  await validateAccount(destinationAccount);
  const { balance } = await findByAccount(destinationAccount);
  const newBalance = balance + value;
  await updateBalance(destinationAccount, newBalance);
  const depositId = await registerDeposit(destinationAccount, value);
  const newDeposit = {
    DepositId: depositId,
    Message: 'Deposit complete.'
  };

  return newDeposit;
};

const getAllDeposits = async () => {
  const result = await findAllDeposit();

  return result;
};

const getDepositsByAccountNum = async(destinationAccount) => {
  await validateAccount(destinationAccount);
  const result = await findDepositByAccountNum(destinationAccount);

  return result;
};

module.exports = {
  validateDepositSchema,
  validateAccount,
  depositMoney,
  getAllDeposits,
  getDepositsByAccountNum,
}