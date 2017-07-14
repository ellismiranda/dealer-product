const knex = require('../utils/uKnex.js');
const tools = require('../utils/uTools.js');

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

    knex.update({lease_miles_per_year,
                  lease_total_driveoff,
                  zipcode,
                  credit_score}, convo.context.user);

    tools.adjustFinance('lease', convo.context.user);

    next();
  })

  controller.studio.after('cash', async function(convo, next) {

    const {
      zipcode,
    } = convo.extractResponses();

    knex.update({zipcode}, convo.context.user);

    tools.adjustFinance('cash', convo.context.user);

    next();
  })

  controller.studio.after('finance', async function(convo, next) {

    const {
      finance_years,
      finance_down,
      zipcode,
      credit_score
    } = convo.extractResponses();

    knex.update({finance_years,
                  finance_down,
                  zipcode,
                  credit_score}, convo.context.user);

    tools.adjustFinance('finance', convo.context.user);

    next();
  })

}
