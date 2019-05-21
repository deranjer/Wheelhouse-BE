/* eslint-disable import/order */
/* eslint-disable no-undef */
const { Model } = require('objection');
const knexfile = require('../../knexfile').test;
const knex = require('knex')(knexfile);
const User = require('../../models/User');
const Project = require('../../models/Project');
const Category = require('../../models/Category');
const ProjectCategory = require('../../models/ProjectCategory');

describe('Category Objection model', () => {
  beforeAll(async (done) => {
    await knex.migrate.latest();
    Model.knex(knex);

    done();
  });

  beforeEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects, categories CASCADE');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE categories_id_seq RESTART WITH 1');

    await User.query().insertGraph({
      username: 'JoRyGu',
      email: 'josh@josh.net',
      password: '12345678',
      work_status: 'Looking For Work',
    });

    this.projects = await Project.query().insertGraph([
      {
        user_id: 1,
        name: 'Cool Project',
        created_at: new Date(),
      },
      {
        user_id: 1,
        name: 'Cooler Project',
        created_at: new Date(),
      },
    ]);

    done();
  });

  afterEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects, categories CASCADE');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    done();
  });

  describe('Category.query().insertGraph()', () => {
    it('Should create a new category in the database', async (done) => {
      const category = await Category.query().insertGraph({
        tag: 'Technology',
      });

      expect(category.tag).toBe('Technology');
      done();
    });

    it('Should throw an error if a tag is missing', async (done) => {
      try {
        await Category.query().insertGraph({});
      } catch (err) {
        expect(err).not.toBeNull();
        done();
      }
    });
  });

  describe('Category.query()', () => {
    it('Should return a list of all categories from the categories table', async (done) => {
      await Category.query().insertGraph({
        tag: 'Technology',
      });

      const categories = await Category.query();
      expect(categories[0].tag).toBe('Technology');
      done();
    });
  });

  describe('category instance method category.$relatedQuery()', () => {
    it('Should return a list of projects associated with this instance\'s tag', async (done) => {
      const category = await Category.query().insertGraph({
        tag: 'Technology',
      });

      await ProjectCategory.query().insertGraph({
        project_id: 1,
        category_id: 1,
      });

      await ProjectCategory.query().insertGraph({
        project_id: 2,
        category_id: 1,
      });

      const projects = await category.$relatedQuery('projects');
      expect(projects[0].name).toBe('Cool Project');
      done();
    });
  });
});
