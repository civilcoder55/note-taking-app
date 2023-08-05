const sequelize = require('../databases/mysql');
require('../models');

(async () => {
  await sequelize.sync({ alter: true });
  console.log('database synced');
})();
