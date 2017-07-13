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
  update,
}

function getUserData(firstData, user) {
  return knex.table('users')
              .where('uuid', user)
              .first(firstData);
}

function update(updates, user) {
  knex.table('users')
      .where('uuid', user)
      .update(updates)
      .then(function() { });
}
