const express = require('express');
const { listAllDeposits, newDeposit, listDepositsByAccountNum } = require('../controllers/depositsController');
const depositsRouter = express.Router();

depositsRouter.get('/', listAllDeposits);

depositsRouter.post('/', newDeposit);

depositsRouter.get('/:accountNumber', listDepositsByAccountNum);

module.exports = depositsRouter;