var knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: process.env.pgHost,
    user: process.env.pgUser,
    password: process.env.pgPass,
    database: process.env.pgDB,
  }
});

module.exports = function(controller) {

  controller.studio.after('lease', function(convo, next) {
    var vars = convo.extractResponses();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .update({leaseMilesPerYear: vars.miles_per_year,
                leaseTotalDriveoff: vars.total_driveoff,
                zipcode: vars.lease_zipcode,
                creditScore: vars.credit_score})
        .then(function() { });

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .then(function(res) {

          console.log(res);
          if (res.currentFinancePreference !== null && res.currentFinancePreference !== 'lease') {
            knex.table('users')
                .where('uuid', convo.context.user)
                .update({lastFinancePreference: res.currentFinancePreference})
                .then(function() { });
          }
          knex.table('users')
              .where('uuid', convo.context.user)
              .update({currentFinancePreference: 'lease'})
              .then(function() { });
          });
    next();
  })

  controller.studio.after('cash', function(convo, next) {
    var vars = convo.extractResponses();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .update({zipcode: vars.zipcode})
        .then(function() { });

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .then(function(res) {
          if (res.currentFinancePreference !== null && res.currentFinancePreference !== 'cash') {
            knex.table('users')
                .where('uuid', convo.context.user)
                .update({lastFinancePreference: res.currentFinancePreference})
                .then(function() { });
          }
          knex.table('users')
              .where('uuid', convo.context.user)
              .update({currentFinancePreference: 'cash'})
              .then(function() { });
        });
    next();
  })

  controller.studio.after('finance', function(convo, next) {
    var vars = convo.extractResponses();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .update({financeYears: vars.finance_years,
                financeDown: vars.finance_down,
                zipcode: vars.zipcode,
                creditScore: vars.credit_score})
        .then(function() { });

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .then(function(res) {
          if (res.currentFinancePreference !== null && res.currentFinancePreference !== 'finance') {
            knex.table('users')
                .where('uuid', convo.context.user)
                .update({lastFinancePreference: res.currentFinancePreference})
                .then(function() { });
          }
          knex.table('users')
              .where('uuid', convo.context.user)
              .update({currentFinancePreference: 'finance'})
              .then(function() { });
        });
    next();
  })


}
