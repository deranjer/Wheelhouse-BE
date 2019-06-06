const { Model } = require('objection');
const Project = require('./Project');
const Competency = require('./Competency');
const Position = require('./Position');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'email', 'password', 'work_status'],

      properties: {
        id: { type: 'integer' },
        full_name: { type: 'string', minLength: 1, maxLength: 40 },
        username: { type: 'string', minLength: 1, maxLength: 40 },
        password: { type: 'string', minLength: 8, maxLength: 255 },
        profile_photo_url: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
        header_photo_url: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
        work_status: { type: 'string', minLength: 1, maxLength: 40 },
        bio: { type: ['string', 'null'], minLength: 1, maxLength: 600 },
      },
    };
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const Permission = require('./Permission');

    return {
      projects: {
        relation: Model.HasManyRelation,
        modelClass: Project,
        join: {
          from: 'users.id',
          to: 'projects.user_id',
        },
      },

      competencies: {
        relation: Model.ManyToManyRelation,
        modelClass: Competency,
        join: {
          from: 'users.id',
          through: {
            from: 'user_competencies.user_id',
            to: 'user_competencies.competency_id',
          },
          to: 'competencies.id',
        },
      },

      positions: {
        relation: Model.HasManyRelation,
        modelClass: Position,
        join: {
          from: 'users.id',
          to: 'positions.user_id',
        },
      },

      permission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Permission,
        join: {
          from: 'users.permissions_id',
          to: 'permissions.id',
        },
      },
    };
  }

  async getCompetencies() {
    const competencies = await this.$relatedQuery('competencies');
    return competencies;
  }
}

module.exports = User;
