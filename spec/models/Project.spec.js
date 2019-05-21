/* eslint-disable import/order */
/* eslint-disable no-undef */
const { Model } = require('objection');
const knexfile = require('../../knexfile').test;
const knex = require('knex')(knexfile);
const User = require('../../models/User');
const Project = require('../../models/Project');
const Category = require('../../models/Category');
const ProjectCategory = require('../../models/ProjectCategory');

describe('Project objection model', () => {
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
      full_name: 'Josh G',
      username: 'JoRyGu',
      email: 'jrg@test.com',
      password: '12345678',
      work_status: 'Employed',
    });

    done();
  });

  afterEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects, categories CASCADE');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    done();
  });

  describe('Project.query().insertGraph()', () => {
    it('Should create a project in the database', async (done) => {
      const project = await Project.query().insertGraph({
        user_id: 1,
        name: 'Cool Project',
        created_at: new Date(),
      });

      expect(project.name).toBe('Cool Project');
      done();
    });

    it('Should throw an error if a project is not attached to a valid user ID', async (done) => {
      try {
        await Project.query().insertGraph({
          name: 'Cool Project',
          created_at: new Date(),
        });
      } catch (err) {
        expect(err).not.toBeNull();
        done();
      }
    });

    it('Should throw an error if a name is not submitted', async (done) => {
      try {
        await Project.query().insertGraph({
          user_id: 1,
          created_at: new Date(),
        });
      } catch (err) {
        expect(err).not.toBeNull();
        done();
      }
    });

    it('Should throw an error if a create_at timestamp is not submitted', async (done) => {
      try {
        await Project.query().insertGraph({
          user_id: 1,
          name: 'Cool Project',
        });
      } catch (err) {
        expect(err).not.toBeNull();
        done();
      }
    });
  });

  describe('project instance method project.$relatedQuery("user")', () => {
    it('Should return the user that created this project', async (done) => {
      const project = await Project.query().insertGraph({
        user_id: 1,
        name: 'Cool Project',
        created_at: new Date(),
      });

      const user = await project.$relatedQuery('user');
      expect(user.full_name).toBe('Josh G');
      done();
    });
  });

  describe('project instance method project.$relatedQuery("categories")', () => {
    it('Should return all of the categories associated with this project', async (done) => {
      const project = await Project.query().insertGraph({
        user_id: 1,
        name: 'Cool Project',
        created_at: new Date(),
      });

      await Category.query().insertGraph([
        { tag: 'Technology' },
        { tag: 'React' },
        { tag: 'JavaScript' },
      ]);

      await ProjectCategory.query().insertGraph([
        { project_id: 1, category_id: 1 },
        { project_id: 1, category_id: 2 },
        { project_id: 1, category_id: 3 },
      ]);

      const categories = await project.$relatedQuery('categories');
      expect(categories[0].tag).toBe('Technology');
      done();
    });
  });

  describe('project instance method project.$relatedQuery("categories").insert', () => {
    it('Should insert stuff', async (done) => {
      const project = await Project.query().insertGraph({
        user_id: 1,
        name: 'Cool Project',
        created_at: new Date(),
      });

      await project.$relatedQuery('categories').insertGraph([
        { tag: 'Technology' },
        { tag: 'React' },
        { tag: 'JavaScript' },
      ]);

      const categories = await project.$relatedQuery('categories');
      expect(categories[0].tag).toBe('Technology');
      done();
    });
  });
});
