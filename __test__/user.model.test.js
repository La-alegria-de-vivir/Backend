import User from "../Models/user.model.js";

describe('User Model', () => {
  it('should have a defined schema', () => {
    expect(User.schema).toBeDefined();
  });

  it('should create a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      isAdmin: false,
    };

    const user = new User(userData);

    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.isAdmin).toBe(userData.isAdmin);
  });
});
