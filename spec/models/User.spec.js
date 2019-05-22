/* eslint-disable import/order */
/* eslint-disable no-undef */
const { Model } = require('objection');
const knexfile = require('../../knexfile').test;
const knex = require('knex')(knexfile);
const User = require('../../models/User');
const Project = require('../../models/Project');
const Competency = require('../../models/Competency');
const UserCompetency = require('../../models/UserCompentency');

describe('User Objection Model', () => {
  beforeAll(async (done) => {
    await knex.migrate.latest();
    Model.knex(knex);
    done();
  });

  beforeEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects CASCADE');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    done();
  });

  afterEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, projects CASCADE');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    done();
  });

  describe('User.query().insertGraph()', () => {
    it('Should create a user in the database', async (done) => {
      const user = await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'jg@test.com',
        password: '12345678',
        work_status: 'Employed',
      });

      expect(user.full_name).toBe('Josh G');
      done();
    });
  });

  it('Should throw an error if query is missing username field', async (done) => {
    try {
      await User.query().insertGraph({
        full_name: 'Josh G',
        email: 'jg@test.com',
        password: '12345678',
        work_status: 'Employed',
      });

      done();
    } catch (err) {
      expect(err.data.username[0].keyword).toBe('required');
      done();
    }
  });

  it('Should throw an error if query is missing email field', async (done) => {
    try {
      await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        password: '12345678',
        work_status: 'Employed',
      });

      done();
    } catch (err) {
      expect(err.data.email[0].keyword).toBe('required');
      done();
    }
  });

  it('Should throw an error if query is missing password field', async (done) => {
    try {
      await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.test',
        work_status: 'Employed',
      });
    } catch (err) {
      expect(err.data.password[0].keyword).toBe('required');
      done();
    }
  });

  it('Should throw an error if query is missing work_status field', async (done) => {
    try {
      await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.test',
        password: '12345678',
      });
    } catch (err) {
      expect(err.data.work_status[0].keyword).toBe('required');
      done();
    }
  });

  it('Should throw an error if email field is a duplicate', async (done) => {
    try {
      await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.test',
        password: '12345678',
        work_status: 'Employed',
      });

      await User.query().insertGraph({
        full_name: 'Jared G',
        username: 'JaredG',
        email: 'j@josh.test',
        password: '12345678',
        work_status: 'Employed',
      });
    } catch (err) {
      expect(err.detail).toBe('Key (email)=(j@josh.test) already exists.');
      done();
    }
  });

  it('Should throw an error if username field is a duplicate', async (done) => {
    try {
      await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.test',
        password: '12345678',
        work_status: 'Employed',
      });

      const dupeUser = await User.query().insertGraph({
        full_name: 'Jared G',
        username: 'JoRyGu',
        email: 'jared@josh.test',
        password: '12345678',
        work_status: 'Employed',
      });

      expect(dupeUser).toBeUndefined();
      done();
    } catch (err) {
      expect(err.detail).toBe('Key (username)=(JoRyGu) already exists.');
      done();
    }
  });

  describe('User.query().findById()', () => {
    it('Should return an object containing the information of the user requested by the id', async (done) => {
      await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.net',
        password: '12345678',
        work_status: 'Employed',
      });

      const user = await User.query().findById(1);
      expect(user.full_name).toBe('Josh G');
      done();
    });

    it('Should return undefined if ID is not found in database', async (done) => {
      await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.net',
        password: '12345678',
        work_status: 'Employed',
      });

      const user = await User.query().findById(2);
      expect(user).toBeUndefined();
      done();
    });

    it('Should still return the correct user if ID is passed as a string', async (done) => {
      await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.net',
        password: '12345678',
        work_status: 'Employed',
      });

      const user = await User.query().findById('1');
      expect(user.full_name).toBe('Josh G');
      done();
    });
  });

  describe('user.$relatedQuery("projects")', () => {
    it('Should return a list of instances projects associated with the user', async (done) => {
      const user = await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.net',
        password: '12345678',
        work_status: 'Employed',
      });

      await Project.query().insertGraph({
        user_id: 1,
        name: 'Cool Project',
        created_at: new Date(),
      });

      const projects = await user.$relatedQuery('projects');
      expect(projects[0].id).toBe(1);
      done();
    });
  });

  describe('user.$relatedQuery("competencies")', () => {
    it('Should return a list of instances of competencies related to the user', async (done) => {
      const user = await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.net',
        password: '12345678',
        work_status: 'Employed',
      });

      await Competency.query().insertGraph([
        { tag: 'C#' },
        { tag: 'Java' },
        { tag: 'JavaScript' },
      ]);

      await UserCompetency.query().insertGraph([
        { user_id: 1, competency_id: 1 },
        { user_id: 1, competency_id: 2 },
        { user_id: 1, competency_id: 3 },
      ]);

      const tags = await user.$relatedQuery('competencies');
      expect(tags[0].tag).toBe('C#');
      done();
    });
  });

  describe('user.$relatedQuery("competencies").relate()', () => {
    it('Should relate the user instance to an existing competency', async (done) => {
      await Competency.query().insertGraph([
        { tag: 'C#' },
        { tag: 'React' },
      ]);

      const user = await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.net',
        password: '12345678',
        work_status: 'Employed',
      });

      await user.$relatedQuery('competencies').relate([1, 2]);
      const competencies = await user.getCompetencies();
      expect(competencies.length).toBe(2);
      done();
    });
  });

  describe('user.$relatedQuery("permission")', () => {
    it('Should return the permission associated with this user', async (done) => {
      const user = await User.query().insertGraph({
        full_name: 'Josh G',
        username: 'JoRyGu',
        email: 'j@josh.net',
        password: '12345678',
        permissions_id: 1,
        work_status: 'Employed',
      });

      const permission = await user.$relatedQuery('permission');
      expect(permission.description).toBe('user');
      done();
    });
  });
});
