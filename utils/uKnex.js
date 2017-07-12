const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: process.env.pgHost,
    user: process.env.pgUser,
    password: process.env.pgPass,
    database: process.env.pgDB,
  }
});

module.exports = {
  getUserData,
}

function getUserData(firstData, user) {
  return knex.table('users')
              .where('uuid', user)
              .first(firstData);
}
