/* eslint-disable object-curly-newline */
/* eslint-disable import/order */
/* eslint-disable no-undef */
const { Model } = require('objection');
const knexfile = require('../../knexfile').test;
const knex = require('knex')(knexfile);
const User = require('../../models/User');
const Competency = require('../../models/Competency');

describe('Competency Objection model', () => {
  beforeAll(async (done) => {
    await knex.migrate.latest();
    Model.knex(knex);

    done();
  });

  beforeEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, competencies CASCADE');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE competencies_id_seq RESTART WITH 1');

    await User.query().insertGraph({
      username: 'JoRyGu',
      email: 'josh@josh.net',
      password: '12345678',
      work_status: 'Employed',
    });

    done();
  });

  afterEach(async (done) => {
    await knex.raw('TRUNCATE TABLE users, competencies CASCADE');
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex.raw('ALTER SEQUENCE competencies_id_seq RESTART WITH 1');

    done();
  });

  describe('Competency.query().insertGraph()', () => {
    it('Should insert a new competency into the table', async (done) => {
      const competency = await Competency.query().insertGraph({
        tag: 'C#',
      });

      expect(competency.tag).toBe('C#');
      done();
    });

    it('Should throw an error if the tag is missing', async (done) => {
      try {
        await Competency.query().insertGraph({});
      } catch (err) {
        expect(err).not.toBeNull();
        done();
      }
    });
  });

  describe('competency instance method competency.$relatedQuery("users")', () => {
    it('Should return a list of users associated with this competency', async (done) => {
      const user = await User.query().findById(1);
      const tags = await user.$relatedQuery('competencies').insertGraph([
        { tag: 'C#' },
        { tag: 'JavaScript' },
      ]);

      const users = await tags[0].$relatedQuery('users');
      expect(users[0].username).toBe('JoRyGu');
      done();
    });
  });
});
