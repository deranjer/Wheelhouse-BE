const { Model } = require('objection');
const knex = require('knex')(require('./knexfile').development);

const User = require('./models/User');

Model.knex(knex);

async function addUserTest() {
  await User.query().insertGraph({
    full_name: 'Josh Gude',
    username: 'JoRyGu',
    email: 'jorygu@aol.com',
    password: '12345678',
    work_status: 'Employed',
    bio: 'Hey ma, look it\'s me!',
  });

  knex.destroy();
}

addUserTest();
