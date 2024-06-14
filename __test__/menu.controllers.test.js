import { create, deletemenu, updatemenu } from '../Controllers/menu.controllers.js';
import Menu from '../Models/menu.model.js';
import { errorHandler } from '../Middlewares/error.js';


jest.mock('../Models/menu.model.js');
jest.mock('../Middlewares/error.js');

// Tests para el controlador 'create'
describe('Menu Controllers - Create', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { isAdmin: true, id: 'userId' },
      body: { title: 'Test Menu', price: 10, description: 'Test Description' }
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('should create a new menu', async () => {
    const saveMock = jest.fn().mockResolvedValue({ title: 'Test Menu' });
    Menu.mockReturnValueOnce({ save: saveMock });

    await create(req, res, next);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ title: 'Test Menu' });
    expect(next).not.toHaveBeenCalled();
  });

});

// Tests para el controlador 'deletemenu'
describe('Menu Controllers - Delete Menu', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { menuId: 'menuId' }
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('should delete a menu', async () => {
    Menu.findByIdAndDelete.mockResolvedValue({});

    await deletemenu(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('The menu has been deleted');
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle errors', async () => {
    const error = new Error('Test Error');
    Menu.findByIdAndDelete.mockRejectedValue(error);

    await deletemenu(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// Tests para el controlador 'updatemenu'
describe('Menu Controllers - Update Menu', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { isAdmin: true, id: 'userId' },
      params: { menuId: 'menuId', userId: 'userId' },
      body: { title: 'Updated Title', price: 20, description: 'Updated Description' }
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('should update a menu', async () => {
    Menu.findByIdAndUpdate.mockResolvedValue({ title: 'Updated Title' });

    await updatemenu(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ title: 'Updated Title' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle errors', async () => {
    const error = new Error('Test Error');
    Menu.findByIdAndUpdate.mockRejectedValue(error);

    await updatemenu(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
