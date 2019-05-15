const { Model } = require('objection');

class Milestone extends Model {
  static get tableName() {
    return 'milestones';
  }
}

module.exports = Milestone;
