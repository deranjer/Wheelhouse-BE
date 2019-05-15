const { Model } = require('objection');

class ProjectCategory extends Model {
  static get tableName() {
    return 'project_categories';
  }
}

module.exports = ProjectCategory;
