/* eslint-disable no-plusplus */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const faker = require('faker');

const topics = [];

for (let i = 0; i < 400; i++) {
  topics.push({
    full_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    username: faker.hacker.noun() + i,
    email: `${faker.company.bsNoun() + i}@faker.net`,
    password: faker.random.uuid(),
    work_status: 'Employed',
  });
}

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert(topics);
    });
};
