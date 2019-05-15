const { Model } = require('objection');

class Competency extends Model {
  static get tableName() {
    return 'competencies';
  }
}

module.exports = Competency;
