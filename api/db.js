const { Pool } = require('pg');

const pools = {
  user1: new Pool({ connectionString: process.env.DATABASE_URL_USER1 }),
  user2: new Pool({ connectionString: process.env.DATABASE_URL_USER2 }),
};

module.exports = (user) => {
  if (!pools[user]) throw new Error(`No database connection for user: ${user}`);
  return pools[user];
};
