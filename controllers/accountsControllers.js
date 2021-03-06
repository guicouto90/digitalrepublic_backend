const { newAccount, getAccounts, editAccount, validDelete } = require("../services/accountsServices");

const listAllAccounts = async(req, res, next) => {
  try {
    const accounts = await getAccounts();
    return res.status(200).json(accounts);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const insertAccount = async(req, res, next) => {
  try {
    const { name, lastName, cpf, initialDeposit } = req.body;
    const account = await newAccount(name, lastName, cpf, initialDeposit);

    return res.status(201).json(account)
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const updateAccount = async(req, res, next) => {
  try {
    const { accountNumber } = req.params;
    const result = await editAccount(req.body, Number(accountNumber));

    return res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const eraseAccount = async(req, res, next) => {
  try {
    const { accountNumber } = req.params;
    const result = await validDelete(Number(accountNumber));

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

module.exports = {
  listAllAccounts,
  insertAccount,
  updateAccount,
  eraseAccount,
}