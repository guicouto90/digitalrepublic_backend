const { depositMoney, getAllDeposits, getDepositsByAccountNum } = require("../services/depositsServices");

const newDeposit = async(req, res, next) => {
  try {
    const { destinationAccount, value } = req.body;    
    const deposit = await depositMoney(destinationAccount, value);

    return res.status(201).json(deposit);
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

const listAllDeposits = async(req, res, next) => {
  try {
    const deposits = await getAllDeposits();

    return res.status(200).json(deposits);
  } catch (error) {
    console.error(error.message);
    next(error)
  }
}

const listDepositsByAccountNum = async(req, res, next) => {
  try {
    const { accountNumber } = req.params;
    const deposits = await getDepositsByAccountNum(Number(accountNumber));

    return res.status(200).json(deposits);
  } catch (error) {
    console.error(error.message);
    next(error)
  }
};

module.exports = {
  newDeposit,
  listAllDeposits,
  listDepositsByAccountNum,
}