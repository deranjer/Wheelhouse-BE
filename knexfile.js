module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.devDatabase,
      user: process.env.username,
      password: process.env.password,
      host: "127.0.0.1"
    }
  }
};
