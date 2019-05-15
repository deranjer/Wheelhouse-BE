const { Model } = require('objection');
const User = require('objection');

class Competency extends Model {
  static get tableName() {
    return 'competencies';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'tag'],

      properties: {
        id: { type: 'integer' },
        tag: { type: 'string', minLength: 1, maxLength: 40 },
      },
    };
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'competencies.id',
          through: {
            from: 'user_competencies.competency_id',
            to: 'user_competencies.user_id',
          },
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Competency;
