const mongoose = require("mongoose");

/**
 * Function to async connect to the database
 * @function
 */
const dataBaseConn = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${connection.connection.host}`);
};

module.exports = dataBaseConn;
