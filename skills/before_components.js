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
const tools = require('../utils/uTools.js');

module.exports = function(controller) {

  controller.studio.before('has_td_scheduled', function(convo, next) {
    knex.table('users')
        .where('uuid', convo.context.user)
        .first('td_date', 'td_time', 'location', 'td_car_make')
        .then(function(res) {
          convo.setVar('_td_date', res.td_date);
          convo.setVar('_td_time', res.td_time);
          convo.setVar('_location', res.location);
        })
    next();
  })

  //makes use of encapsulated knex calls, EXAMPLE FOR ENCAPSULATING OTHERS
  controller.studio.before('test_drive', async function(convo, next) {
    const res = await knex2.getUserData('td_date', convo.context.user);
    convo.setVar('_td_date', res.td_date);
    next();
  })

  //checks whether tomorrow's date is necessary for the test drive
  controller.studio.beforeThread('test_drive', 'td_time', function(convo, next) {

    const tomorrow = tools.getTomorrowDate();

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('td_date')
        .then(function(res) {
          if (res.td_date == null) {
            convo.setVar('_td_date', tomorrow);
            knex.table('users')
                .where('uuid', convo.context.user)
                .update('td_date', tomorrow)
                .then(function() { });
          }
        })

    next();
  })

  controller.studio.before('lease', function(convo, next) {
    knex.table('users')
        .where('uuid', convo.context.user)
        .first('lease_miles_per_year','lease_total_driveoff','zipcode', 'current_finance_preference')
        .then(function(res) {
          const paymentOption = res.current_finance_preference;
          if (paymentOption !== null) {
            if (paymentOption === 'lease') {
              convo.setVar('miles_per_year', res.lease_miles_per_year);
              convo.setVar('total_driveoff', res.lease_total_driveoff);
              convo.setVar('lease_zipcode', res.zipcode);
              convo.gotoThread('answered_leaseq');
              next();
            } else {
              convo.setVar('other_pay', paymentOption);
              convo.gotoThread('other_plan');
              next();
            }
          } else {
            next();
          }
        });
    })

  controller.studio.before('cash', function(convo, next) {
    knex.table('users')
        .where('uuid', convo.context.user)
        .first('zipcode', 'current_finance_preference')
        .then(function(res) {
          const paymentOption = res.current_finance_preference;
          if (paymentOption !== null) {
            if (paymentOption === 'cash') {
              convo.setVar('zipcode', res.zipcode);
              convo.gotoThread('answered_cashq');
              next();
            } else {
              convo.setVar('other_pay', paymentOption);
              convo.gotoThread('other_plan');
              next();
            }
          } else {
            next();
          }
        });
  })

  controller.studio.before('finance', function(convo, next) {
    knex.table('users')
        .where('uuid', convo.context.user)
        .first('finance_years','finance_down','zipcode', 'current_finance_preference')
        .then(function(res) {
          const paymentOption = res.current_finance_preference;
          if (paymentOption !== null) {
            if (paymentOption === 'finance') {
              convo.setVar('finance_years', res.finance_years);
              convo.setVar('finance_down', res.finance_down);
              convo.setVar('zipcode', res.zipcode);
              convo.gotoThread('answered_financeq');
              next();
            } else {
              convo.setVar('other_pay', paymentOption);
              convo.gotoThread('other_plan');
              next();
            }
          }
      });
  })

}
