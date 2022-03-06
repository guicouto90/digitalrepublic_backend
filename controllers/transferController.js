const { transferMoney, getAllTransfers, getTransferById, getTransferByAccountNum } = require("../services/transfersService");

const listAllTransfers = async(req, res, next) => {
  try {
    const result = await getAllTransfers();

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

const newTransfer = async(req, res, next) => {
  try {
    const { accountNumber } = req.params;
    const { destinationAccount, value } = req.body;  

    const result = await transferMoney(Number(accountNumber), destinationAccount, value);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const listTransferById = async(req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getTransferById(id);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const listTransfersByAccount = async(req, res, next) => {
  try {
    const { accountNumber } = req.params;
    
    const result = await getTransferByAccountNum(Number(accountNumber));

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

module.exports = {
  listAllTransfers,
  newTransfer,
  listTransferById,
  listTransfersByAccount
}