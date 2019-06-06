exports.up = function (knex) {
  return knex.schema
    .createTable('permissions', (table) => {
      table.increments('id');
      table.string('description', 40);
    })
    .alterTable('users', (table) => {
      table.integer('permissions_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('SET NULL');
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('users', (table) => {
      table.dropColumn('permissions_id');
    })
    .dropTable('permissions');
};
