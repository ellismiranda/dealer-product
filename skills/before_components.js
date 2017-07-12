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

  controller.studio.before('has_td_scheduled', function(convo, next) {
    knex.table('users')
        .where('uuid', convo.context.user)
        .first('tdDate', 'tdTime', 'location', 'tdCarMake')
        .then(function(res) {
          convo.setVar('_td_date', res.tdDate);
          convo.setVar('_td_time', res.tdTime);
          convo.setVar('_location', res.location);
        })
    next();
  })

  //sets the variable in the script? not necessary!
  controller.studio.before('test_drive', function(convo, next) {
    knex.table('users')
        .where('uuid', convo.context.user)
        .first('tdDate')
        .then(function(res) {
          convo.setVar('_td_date', res.tdDate);
        })
    next();
  })

  //checks whether tomorrow's date is necessary for the test drive
  controller.studio.beforeThread('test_drive', 'td_time', function(convo, next) {
    const date = new Date();
    const tomorrow = (date.getMonth() + 1) + '.' + (date.getDate() + 1) + '.' + (date.getFullYear());

    knex.table('users')
        .where('uuid', convo.context.user)
        .first('tdDate')
        .then(function(res) {
          console.log(res.tdDate);
          if (res.tdDate == null) {
            convo.setVar('_td_date', tomorrow);
            knex.table('users')
                .where('uuid', convo.context.user)
                .update('tdDate', tomorrow)
                .then(function() { });
          }
        })

    next();
  })

  controller.studio.before('lease', function(convo, next) {
    knex.table('users')
        .where('uuid', convo.context.user)
        .first('leaseMilesPerYear','leaseTotalDriveoff','zipcode', 'currentFinancePreference')
        .then(function(res) {
          var paymentOption = res.currentFinancePreference;
          if (paymentOption !== null) {
            if (paymentOption === 'lease') {
              convo.setVar('miles_per_year', res.leaseMilesPerYear);
              convo.setVar('total_driveoff', res.leaseTotalDriveoff);
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
        .first('zipcode', 'currentFinancePreference')
        .then(function(res) {
          var paymentOption = res.currentFinancePreference;
          if (paymentOption !== '') {
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
        .first('financeYears','financeDown','zipcode', 'currentFinancePreference')
        .then(function(res) {
          var paymentOption = res.currentFinancePreference;
          if (paymentOption !== '') {
            if (paymentOption === 'finance') {
              convo.setVar('finance_years', res.financeYears);
              convo.setVar('finance_down', res.financeDown);
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
