const dotenv = require("dotenv");

const result = dotenv.config();
const envs = result.parsed;

module.exports = {
  MONGODB: process.env.MONGODB_URI,
  SECRET_KEY: process.env.JWT_SECRET,
  PORT: process.env.PORT,
};
