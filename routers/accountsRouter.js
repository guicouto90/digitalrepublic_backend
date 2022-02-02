const express = require('express');
const { listAllAccounts, insertAccount, eraseAccount, updateAccount } = require('../controllers/accountsControllers');
const accountsRouter = express.Router();

accountsRouter.get('/', listAllAccounts);

accountsRouter.post('/', insertAccount);

accountsRouter.put('/:accountNumber', updateAccount)

accountsRouter.delete('/:accountNumber', eraseAccount)

module.exports = accountsRouter;