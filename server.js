/**EVERTHING THAT IS NOT RELATED TO EXPRESS */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

/**Handling synchronous exceptions */
process.on('uncaughtException', err => {
  console.log('UNCAUGHT REJECTION! 💣 SHUTING DOWN!');
  console.log(err.name, err.message);

  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM INITIATED. Shutting down.');

  server.close(() => {
    console.log('Proces terminated');
  });
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

/**Connecting to mongoDB */
mongoose.connect(DB).then(conn => {
  console.log('Connection successful with DB');
});

const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// GLOBAL ERROR HANDLERS
/**ERROR FOR ASYNCHRONOUS CODE EG DB CONNECTION */
process.on('unhandledRejection', (err, promise) => {
  console.log('UNHANDLED REJECTION! 💣 SHUTING DOWN!');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
