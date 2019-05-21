/* eslint-disable import/order */
/* eslint-disable no-undef */
const { Model } = require('objection');
const knexfile = require('../../knexfile').test;
const knex = require('knex')(knexfile);
const User = require('../../models/User');
const Project = require('../../models/Project');
const Position = require('../../models/Position');

describe('Position Objection model', () => {
  beforeAll(async (done) => {
    await knex.migrate.latest();
    Model.knex(knex);

    done();
  });

  beforeEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects, positions CASCADE');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE positions_id_seq RESTART WITH 1');

    await User.query().insertGraph({
      username: 'JoRyGu',
      email: 'jg@jg.net',
      password: '12345678',
      work_status: 'Employed',
    });

    await Project.query().insertGraph({
      user_id: 1,
      name: 'Cool Project',
      created_at: new Date(),
    });

    done();
  });

  afterEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects, positions CASCADE');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE positions_id_seq RESTART WITH 1');

    done();
  });

  describe('Position.query().insertGraph()', () => {
    it('Should create a Position for a specific project.', async (done) => {
      const position = await Position.query().insertGraph({
        project_id: 1,
        title: 'CEO',
        description: 'Manages all aspects of the company',
      });

      expect(position.title).toBe('CEO');
      done();
    });
  });

  it('Should throw an error if the project_id is missing', async (done) => {
    try {
      await Position.query().insertGraph({
        title: 'CEO',
        description: 'Manages all aspects of the company',
      });
    } catch (err) {
      expect(err).not.toBeNull();
      done();
    }
  });

  it('Should throw an error if the title is missing', async (done) => {
    try {
      await Position.query().insertGraph({
        project_id: 1,
        description: 'Manages all aspects of the company',
      });
    } catch (err) {
      expect(err).not.toBeNull();
      done();
    }
  });

  it('Should throw an error if the description is missing', async (done) => {
    try {
      await Position.query().insertGraph({
        project_id: 1,
        title: 'CEO',
      });
    } catch (err) {
      expect(err).not.toBeNull();
      done();
    }
  });

  describe('positions intance method position.$relatedQuery("project")', () => {
    it('Should return the associated project', async (done) => {
      const position = await Position.query().insertGraph({
        project_id: 1,
        title: 'CEO',
        description: 'Run everything',
      });

      const project = await position.$relatedQuery('project');
      expect(project.name).toBe('Cool Project');
      done();
    });
  });

  describe('positions instance method position.$relatedQuery("user")', () => {
    it('Should return the associated user', async (done) => {
      const position = await Position.query().insertGraph({
        project_id: 1,
        user_id: 1,
        title: 'CEO',
        description: 'Run everything.',
      });

      const user = await position.$relatedQuery('user');
      expect(user.username).toBe('JoRyGu');
      done();
    });

    it('Should do something', async (done) => {
      const position = await Position.query().insertGraph({
        project_id: 1,
        title: 'CEO',
        description: 'Run everything.',
      });

      const user = await position.$relatedQuery('user');
      expect(user).toBeUndefined();
      done();
    });
  });
});
