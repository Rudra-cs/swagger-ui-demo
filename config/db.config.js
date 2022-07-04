require("dotenv").config();

config = {
  uri: process.env.MONGO_URI,
};

module.exports = config;
