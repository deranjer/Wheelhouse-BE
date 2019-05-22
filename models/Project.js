const { Model } = require('objection');
const Position = require('./Position');
const Milestone = require('./Milestone');
const Category = require('./Category');

class Project extends Model {
  static get tableName() {
    return 'projects';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'name', 'created_at'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 40 },
        logo_url: { type: 'string', minLength: 1, maxLength: 255 },
        header_photo_url: { type: 'string', minLength: 1, maxLength: 255 },
        tagline: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string', minLength: 1, maxLength: 600 },
        created_at: { type: 'timestamp' },
      },
    };
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const User = require('./User');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'projects.user_id',
          to: 'users.id',
        },
      },

      positions: {
        relation: Model.HasManyRelation,
        modelClass: Position,
        join: {
          from: 'projects.id',
          to: 'positions.project_id',
        },
      },

      milestones: {
        relation: Model.HasManyRelation,
        modelClass: Milestone,
        join: {
          from: 'projects.id',
          to: 'milestones.project_id',
        },
      },

      categories: {
        relation: Model.ManyToManyRelation,
        modelClass: Category,
        join: {
          from: 'projects.id',
          through: {
            from: 'project_categories.project_id',
            to: 'project_categories.category_id',
          },
          to: 'categories.id',
        },
      },
    };
  }
}

module.exports = Project;
