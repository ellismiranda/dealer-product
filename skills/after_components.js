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
      miles_per_year: lease_miles_per_year,
      total_driveoff: lease_total_driveoff,
      zipcode,
      credit_score: credit_score
    } = convo.extractResponses();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('current_finance_preference')
        .update({lease_miles_per_year,
                lease_total_driveoff,
                zipcode,
                credit_score})
        .then(function() { });

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('current_finance_preference')
        .then(function(res) {
          if (res.current_finance_preference !== null && res.current_finance_preference !== 'lease') {
            knex.table('users')
                .where('uuid', convo.context.user)
                .update({last_finance_preference: res.currentFinancePreference})
                .then(function() { });
          }
          knex.table('users')
              .where('uuid', convo.context.user)
              .update({current_finance_preference: 'lease'})
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
        .first('current_finance_preference')
        .update({zipcode})
        .then(function() { });

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('current_finance_preference')
        .then(function(res) {
          if (res.current_finance_preference !== null && res.current_finance_preference !== 'cash') {
            knex.table('users')
                .where('uuid', convo.context.user)
                .update({last_finance_preference: res.current_finance_preference})
                .then(function() { });
          }
          knex.table('users')
              .where('uuid', convo.context.user)
              .update({current_finance_preference: 'cash'})
              .then(function() { });
        });
    next();
  })

  controller.studio.after('finance', function(convo, next) {

    const {
      finance_years: finance_years,
      finance_down: finance_down,
      zipcode,
      credit_score: credit_score
    } = convo.extractResponses();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('current_finance_preference')
        .update({finance_years,
                finance_down,
                zipcode,
                credit_score})
        .then(function() { });

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('current_finance_preference')
        .then(function(res) {
          if (res.current_finance_preference !== null && res.current_finance_preference !== 'finance') {
            knex.table('users')
                .where('uuid', convo.context.user)
                .update({last_finance_preference: res.current_finance_preference})
                .then(function() { });
          }
          knex.table('users')
              .where('uuid', convo.context.user)
              .update({current_finance_preference: 'finance'})
              .then(function() { });
        });
    next();
  })


}
