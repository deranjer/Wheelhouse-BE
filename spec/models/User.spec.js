/* eslint-disable import/order */
/* eslint-disable no-undef */
const { Model } = require('objection');
const knexfile = require('../../knexfile').test;
const knex = require('knex')(knexfile);
const User = require('../../models/User');

describe('User Objection Model', () => {
  beforeAll((done) => {
    Model.knex(knex);
    done();
  });

  beforeEach(async (done) => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    done();
  });

  afterAll(async (done) => {
    knex.destroy();
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
});
