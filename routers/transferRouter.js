const express = require('express');
const { listAllTransfers, newTransfer, listTransferById, listTransfersByAccount } = require('../controllers/transferController');

const transferRouter = express.Router();

transferRouter.get('/', listAllTransfers);

transferRouter.get('/:id', listTransferById)

transferRouter.get('/receipt/:accountNumber', listTransfersByAccount);

transferRouter.post('/:accountNumber', newTransfer);

module.exports = transferRouter;