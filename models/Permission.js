const { Model } = require('objection');

class Permission extends Model {
  static get tableName() {
    return 'permissions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['description'],

      properties: {
        id: { type: 'integer' },
        description: { type: 'string', minLength: 1, maxLength: 40 },
      },
    };
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const User = require('./User');

    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'permissions.id',
          to: 'users.permission_id',
        },
      },
    };
  }
}

module.exports = Permission;
