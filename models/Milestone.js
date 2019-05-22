const { Model } = require('objection');

class Milestone extends Model {
  static get tableName() {
    return 'milestones';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'date', 'project_id'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 40 },
        date: { type: 'timestamp' },
        description: { type: 'string', minLength: 1, maxLength: 300 },
        project_id: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const Project = require('./Project');

    return {
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: 'milestones.project_id',
          to: 'projects.id',
        },
      },
    };
  }
}

module.exports = Milestone;
