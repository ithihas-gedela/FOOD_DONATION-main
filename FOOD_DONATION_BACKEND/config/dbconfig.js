const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;

const MONGO_DE_CONNECTION_URL = MONGO_DB_URL.replace(
  '<db_password>',
  MONGO_DB_PASSWORD
);
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_DE_CONNECTION_URL_WITH_NAME = MONGO_DE_CONNECTION_URL.replace(
  '/?',
  `/${MONGO_DB_NAME}?`
);

const ConnectToDb = () => {
  try {
    mongoose.connect(MONGO_DE_CONNECTION_URL_WITH_NAME);
    console.log('✅ Database connected sucessfully');
  } catch (error) {
    console.log('❌ Database not connected');
  }
};

ConnectToDb();
