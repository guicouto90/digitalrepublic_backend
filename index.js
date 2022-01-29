const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const accountsRouter = require('./routers/accountsRouter');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/accounts', accountsRouter);

app.use(errorHandler);

app.listen(PORT, ()=> console.log(`${PORT} working properly`));

module.exports = app;