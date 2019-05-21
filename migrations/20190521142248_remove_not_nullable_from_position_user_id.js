
exports.up = function (knex) {
  return knex.schema
    .alterTable('positions', (table) => {
      table.integer('user_id')
        .alter();
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('positions', (table) => {
      table.integer('user_id')
        .notNullable()
        .alter();
    });
};
