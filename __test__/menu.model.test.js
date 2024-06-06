import Menu from "../Models/menu.model.js";

describe('Menu Model', () => {
  it('should have a defined schema', () => {
    expect(Menu.schema).toBeDefined();
  });

  it('should create a new menu', async () => {
    const menuData = {
        title: 'testMenu',
        price: 54,
        description: "test description",
    };

    const menu = new Menu(menuData);

    expect(menu.title).toBe(menuData.title);
    expect(menu.price).toBe(menuData.price);
    expect(menu.description).toBe(menuData.description);
  });
});
