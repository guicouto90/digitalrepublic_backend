const { validateAccountData, verifyCpf, newAccount, getAccounts } = require("../services/accountsServices");

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
    validateAccountData(name, lastName, cpf, initialDeposit);
    await verifyCpf(cpf);

    const account = await newAccount(name, lastName, cpf, initialDeposit);

    return res.status(201).json(account)
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  listAllAccounts,
  insertAccount,
}