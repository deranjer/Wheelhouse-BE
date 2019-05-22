/* eslint-disable import/order */
/* eslint-disable no-undef */
const { Model } = require('objection');
const knexfile = require('../../knexfile').test;
const knex = require('knex')(knexfile);
const User = require('../../models/User');
const Project = require('../../models/Project');
const Milestone = require('../../models/Milestone');

describe('Milestone Objection model', () => {
  beforeAll(async (done) => {
    await knex.migrate.latest();
    Model.knex(knex);

    done();
  });

  beforeEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects, milestones CASCADE');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE milestones_id_seq RESTART WITH 1');

    await User.query().insertGraph({
      username: 'JoRyGu',
      email: 'josh@josh.net',
      password: '12345678',
      work_status: 'Looking For Work',
    });

    await Project.query().insertGraph([
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
    await knex.raw('TRUNCATE TABLE users, projects, milestones CASCADE');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE projects_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE milestones_id_seq RESTART WITH 1');

    done();
  });

  describe('Milestone.query().insertGraph()', () => {
    it('Should create a milestone in the milestones table', async (done) => {
      const milestone = await Milestone.query().insertGraph({
        name: 'Project End',
        date: new Date('May 20, 2019 13:30:00'),
        description: 'This is when the project is over',
        project_id: 1,
      });

      expect(milestone.name).toBe('Project End');
      done();
    });

    it('Should throw an error if the name is missing', async (done) => {
      try {
        await Milestone.query().insertGraph({
          date: new Date('May 20, 2019 13:30:00'),
          description: 'This is when the project is over',
          project_id: 1,
        });
      } catch (err) {
        expect(err).not.toBeNull();
        done();
      }
    });

    it('Should throw an error if the date is missing', async (done) => {
      try {
        await Milestone.query().insertGraph({
          name: 'Project End',
          description: 'This is when the project is over',
          project_id: 1,
        });
      } catch (err) {
        expect(err).not.toBeNull();
        done();
      }
    });

    it('Should thrown an error if the project_id is missing', async (done) => {
      try {
        await Milestone.query().insertGraph({
          name: 'Project End',
          date: new Date('May 20, 2019 13:30:00'),
          description: 'This is when the project is over',
        });
      } catch (err) {
        expect(err).not.toBeNull();
        done();
      }
    });
  });

  describe('milestone instance method milestone.$relatedQuery("project")', () => {
    it('Should return an instance of the project that is related to this milestone', async (done) => {
      const milestone = await Milestone.query().insertGraph({
        name: 'Project End',
        date: new Date('May 20, 2019 13:30:00'),
        description: 'This is when the project is over',
        project_id: 1,
      });

      const project = await milestone.$relatedQuery('project');
      expect(project.name).toBe('Cool Project');
      done();
    });
  });
});
