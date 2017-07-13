const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: process.env.pgHost,
    user: process.env.pgUser,
    password: process.env.pgPass,
    database: process.env.pgDB,
  }
});

const knex2 = require('../utils/uKnex.js');

module.exports = function(controller) {

  // THE THREE FOLLOWING FUNCTIONS NEED TO BE TURNED INTO ONE AT SOME POINT
  // OR ENCAPSULATE KNEX AND THEN PASS IN SPECIFIC PARAMETERS FOR EACH (SLIM DOWN THE CODE)

  controller.studio.after('lease', async function(convo, next) {

    const {
      miles_per_year: lease_miles_per_year,
      total_driveoff: lease_total_driveoff,
      zipcode,
      credit_score: credit_score
    } = convo.extractResponses();

    knex2.update({lease_miles_per_year,
                  lease_total_driveoff,
                  zipcode,
                  credit_score}, convo.context.user);

    const { current_finance_preference: currentFinancePreference } = await knex2.getUserData('current_finance_preference', convo.context.user);

    if (currentFinancePreference !== null && currentFinancePreference !== 'lease') {
      knex2.update({last_finance_preference: currentFinancePreference}, convo.context.user);
    }
    knex2.update({current_finance_preference: 'lease'}, convo.context.user);

    next();
  })

  controller.studio.after('cash', async function(convo, next) {

    const {
      zipcode,
    } = convo.extractResponses();

    knex2.update({zipcode}, convo.context.user);

    const { current_finance_preference: currentFinancePreference } = await knex2.getUserData('current_finance_preference', convo.context.user);

    if (currentFinancePreference !== null && currentFinancePreference !== 'cash') {
      knex2.update({last_finance_preference: currentFinancePreference}, convo.context.user);
    }

    knex2.update({current_finance_preference: 'cash'}, convo.context.user);

    next();
  })

  controller.studio.after('finance', async function(convo, next) {

    const {
      finance_years,
      finance_down,
      zipcode,
      credit_score
    } = convo.extractResponses();

    knex2.update({finance_years,
                  finance_down,
                  zipcode,
                  credit_score}, convo.context.user);

    const { current_finance_preference: currentFinancePreference } = await knex2.getUserData('current_finance_preference', convo.context.user);


    if (currentFinancePreference !== null && currentFinancePreference !== 'finance') {
      knex2.update({last_finance_preference: currentFinancePreference}, convo.context.user);
    }

    knex2.update({current_finance_preference: 'finance'}, convo.context.user);

    next();
  })

}
