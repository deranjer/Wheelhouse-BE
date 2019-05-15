const { Model } = require('objection');

class Position extends Model {
  static get tableName() {
    return 'positions';
  }
}

module.exports = Position;
