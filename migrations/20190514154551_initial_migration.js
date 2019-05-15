exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.string('full_name', 40);
      table.string('username', 40).notNullable();
      table.string('email', 40);
      table.string('password', 255);
      table.string('profile_photo_url', 255);
      table.string('header_photo_url', 255);
      table.string('work_status', 40);
      table.text('bio');
    })
    .createTable('projects', (table) => {
      table.increments('id');
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table.string('name', 40).notNullable();
      table.string('logo_url', 255);
      table.string('header_photo_url', 255);
      table.string('tagline', 30);
      table.text('description');
      table.timestamp('created_at').notNullable();
    })
    .createTable('competencies', (table) => {
      table.increments('id');
      table.string('tag', 40).notNullable();
    })
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
    })
    .createTable('categories', (table) => {
      table.increments('id');
      table.string('tag', 40).notNullable();
    })
    .createTable('project_categories', (table) => {
      table.increments('id');
      table.integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
        .notNullable();
    })
    .createTable('milestones', (table) => {
      table.increments('id');
      table.string('name', 40).notNullable();
      table.timestamp('date').notNullable();
      table.string('description', 255);
      table.integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
        .notNullable();
    })
    .createTable('positions', (table) => {
      table.increments('id');
      table.integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table.string('title', 40).notNullable();
      table.string('description', 400).notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('positions')
    .dropTableIfExists('milestones')
    .dropTableIfExists('project_categories')
    .dropTableIfExists('categories')
    .dropTableIfExists('user_compentencies')
    .dropTableIfExists('competencies')
    .dropTableIfExists('projects')
    .dropTableIfExists('users');
};
