const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const accountsRouter = require('./routers/accountsRouter');
const depositsRouter = require('./routers/depositsRouter');
const transferRouter = require('./routers/transferRouter');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/accounts', accountsRouter);

app.use('/transfers', transferRouter);

app.use('/deposits', depositsRouter)

app.use(errorHandler);

app.listen(PORT, ()=> console.log(`${PORT} working properly`));

module.exports = app;