const { Model } = require('objection');
const User = require('./User');
const Project = require('./Project');

class ProjectCategory extends Model {
  static get tableName() {
    return 'project_categories';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['project_id', 'category_id'],

      properties: {
        id: { type: 'integer' },
        project_id: { type: 'integer' },
        category_id: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: 'project_categories.project_id',
          to: 'projects.id',
        },
      },

      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'project_categories.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = ProjectCategory;
