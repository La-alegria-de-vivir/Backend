import { tokenExpirationTime } from '../Middlewares/timeout.js';

describe('Rate Limiting Configuration', () => {
  test('tokenExpirationTime should be set to 3 hours in milliseconds', () => {
    const expectedTime = 3 * 60 * 60 * 1000;
    expect(tokenExpirationTime).toBe(expectedTime);
  });
});
