const express = require('express');
const { listAllAccounts, insertAccount } = require('../controllers/accountsControllers');
const accountsRouter = express.Router();

accountsRouter.get('/', listAllAccounts);

accountsRouter.post('/', insertAccount);

module.exports = accountsRouter;