const { Model } = require('objection');

class Project extends Model {
  static get tableName() {
    return 'projects';
  }
}

module.exports = Project;
