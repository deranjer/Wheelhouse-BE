/* eslint-disable no-undef */
const axios = require('axios');
require('../../app');

const baseRoute = 'http://localhost:5000';

describe('Initial Route', () => {
  it('Should return a status code of 200', async (done) => {
    const response = await axios.get(baseRoute);
    expect(response.status).toBe(200);
    done();
  });
});
