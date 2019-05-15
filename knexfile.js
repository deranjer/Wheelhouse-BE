require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.devDatabase,
      user: process.env.user,
      password: process.env.password,
      host: '127.0.0.1',
    },
  },
};
