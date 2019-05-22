/* eslint-disable global-require */
const { Model } = require('objection');

class Position extends Model {
  static get tableName() {
    return 'positions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['project_id', 'title', 'description'],

      properties: {
        id: { type: 'integer' },
        project_id: { type: 'integer' },
        user_id: { type: ['integer', 'null'] },
        title: { type: 'string', minLength: 1, maxLength: 40 },
        description: { type: 'string', minLength: 1, maxLength: 300 },
      },
    };
  }

  static get relationMappings() {
    const Project = require('./Project');
    const User = require('./User');


    return {
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: 'positions.project_id',
          to: 'projects.id',
        },
      },

      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'positions.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Position;
