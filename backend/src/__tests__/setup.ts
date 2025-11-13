import sequelize from '../utils/database';

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
  } catch (error) {
    console.error('Unable to connect to database for tests:', error);
  }
});

afterAll(async () => {
  await sequelize.close();
});
