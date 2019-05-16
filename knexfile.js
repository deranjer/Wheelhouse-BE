require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.devDatabase,
      user: process.env.user,
      password: process.env.password,
      host: process.env.pghost,
    },
  },

  test: {
    client: 'pg',
    connection: {
      database: process.env.testDatabase,
      user: process.env.testUser,
      password: process.env.testPassword,
      host: process.env.pghost,
    },
  },
};
