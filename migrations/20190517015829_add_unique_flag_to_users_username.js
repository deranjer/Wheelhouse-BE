
exports.up = function (knex) {
  return knex.schema
    .alterTable('users', (table) => {
      table.string('username', 40).notNullable().unique().alter();
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('users', (table) => {
      table.string('username', 40).notNullable().alter();
    });
};
