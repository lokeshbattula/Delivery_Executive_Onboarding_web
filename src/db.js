const mongoose = require('mongoose');

// Replace '<YOUR_CONNECTION_STRING>' with your actual connection string
// MONGODB_URL ="mongodb+srv://lokeshbattula88:uzJdle7vlNesVRWT@cluster0.7kfenuj.mongodb.net/"

const connectionString = process.env.MONGODB_URL;
// const connectionString = MONGODB_URL;
// console.log(connectionString);

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind('Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;