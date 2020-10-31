// This code will connect the node instance to database
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database successfully');
}).catch(() => {
  throw new Error('Database connection failed. Check if db is up and running');
});