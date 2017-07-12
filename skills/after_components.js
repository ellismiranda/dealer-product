const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: process.env.pgHost,
    user: process.env.pgUser,
    password: process.env.pgPass,
    database: process.env.pgDB,
  }
});

module.exports = function(controller) {

  // THE THREE FOLLOWING FUNCTIONS NEED TO BE TURNED INTO ONE AT SOME POINT
  // OR ENCAPSULATE KNEX AND THEN PASS IN SPECIFIC PARAMETERS FOR EACH (SLIM DOWN THE CODE)

  controller.studio.after('lease', function(convo, next) {

    const {
      miles_per_year: leaseMilesPerYear,
      total_driveoff: leaseTotalDriveoff,
      zipcode,
      credit_score: creditScore
    } = convo.extractResponses();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .update({leaseMilesPerYear,
                leaseTotalDriveoff,
                zipcode,
                creditScore})
        .then(function() { });

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .then(function(res) {
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

    const {
      zipcode,
    } = convo.extractResponses();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .update({zipcode})
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

    const {
      finance_years: financeYears,
      finance_down: financeDown,
      zipcode,
      credit_score: creditScore
    } = convo.extractResponses();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('currentFinancePreference')
        .update({financeYears,
                financeDown,
                zipcode,
                creditScore})
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
