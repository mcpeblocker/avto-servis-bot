const { default: mongoose } = require("mongoose");
const config = require("../utils/config");
const logger = require("../utils/logger");

mongoose.connect(config.DB, (err) => {
  if (err) {
    logger.error(`Unable to connect to the database!`, {
      error: err,
      message: err.message,
    });
    process.exit(1);
  }
  logger.info("Database connection established!");
});

const db = {
  models: require("./models"),
};

module.exports = db;
