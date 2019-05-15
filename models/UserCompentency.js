const { Model } = require('objection');
const User = require('./User');
const Competency = require('./Competency');

class UserCompetency extends Model {
  static get tableName() {
    return 'user_competencies';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'user_id', 'competency_id'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        competency_id: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_competencies.user_id',
          to: 'users.id',
        },
      },

      competency: {
        relation: Model.BelongsToOneRelation,
        modelClass: Competency,
        join: {
          from: 'user_competencies.competency_id',
          to: 'competencies.id',
        },
      },
    };
  }
}

module.exports = UserCompetency;
