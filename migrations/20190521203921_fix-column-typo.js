
exports.up = function (knex) {
  return knex.schema
    .dropTable('user_compentencies')
    .createTable('user_competencies', (table) => {
      table.increments('id');
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('competency_id')
        .unsigned()
        .references('id')
        .inTable('competencies')
        .onDelete('CASCADE')
        .notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('user_competencies')
    .createTable('user_compentencies', (table) => {
      table.increments('id');
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('competency_id')
        .unsigned()
        .references('id')
        .inTable('competencies')
        .onDelete('CASCADE')
        .notNullable();
    });
};
