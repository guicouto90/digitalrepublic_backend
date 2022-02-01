const mongodb = require('mongodb').MongoClient;

const MONGO_DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/DigitalRepublic';
const DB_NAME = 'DigitalRepublic';

module.exports = () => mongodb.connect(MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => connection.db(DB_NAME))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
