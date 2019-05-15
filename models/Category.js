const { Model } = require('objection');
const Project = require('./Project');

class Category extends Model {
  static get tableName() {
    return 'categories';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'tag'],

      properties: {
        id: { type: 'integer' },
        tag: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      projects: {
        relation: Model.ManyToManyRelation,
        modelClass: Project,
        join: {
          from: 'categories.id',
          through: {
            from: 'project_categories.category_id',
            to: 'project_categories.project_id',
          },
          to: 'projects.id',
        },
      },
    };
  }
}

module.exports = Category;
