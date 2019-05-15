const { Model } = require('objection');

class UserCompetency extends Model {
  static get tableName() {
    return 'user_competencies';
  }
}

module.exports = UserCompetency;
