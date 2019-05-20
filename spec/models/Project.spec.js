/* eslint-disable import/order */
/* eslint-disable no-undef */
const { Model } = require('objection');
const knexfile = require('../../knexfile').test;
const knex = require('knex')(knexfile);
const User = require('../../models/User');
const Project = require('../../models/Project');

describe('Project objection model', () => {
  beforeAll(async (done) => {
    await knex.migrate.latest();
    Model.knex(knex);

    done();
  });

  beforeEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects CASCADE');
    await knex.raw('TRUNCATE TABLE projects, project_categories CASCADE');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

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
    await knex.raw('TRUNCATE TABLE users, projects CASCADE');
    await knex.raw('TRUNCATE TABLE projects, project_categories CASCADE');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
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
});
