const { Model } = require('objection');

class Category extends Model {
  static get tableName() {
    return 'categories';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['tag'],

      properties: {
        id: { type: 'integer' },
        tag: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const Project = require('./Project');

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
