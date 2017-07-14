const knex = require('../utils/uKnex.js');
const tools = require('../utils/uTools.js');

module.exports = function(controller) {

  controller.studio.before('test_drive', async function(convo, next) {
    const { has_td_scheduled: hasTdScheduled,
            td_date: tdDate,
            td_time: tdTime,
            td_car: tdCar,
            other_car: otherCar
          } = await knex.getUserData(['has_td_scheduled', 'td_date', 'td_time', 'td_car', 'other_car'], convo.context.user);

    if (tdCar) convo.setVar('car', `${tdCar.year} ${tdCar.make} ${tdCar.model}`);
    else if (otherCar) convo.setVar('car', otherCar);
    else {
      //ask what car the user wants to drive
    }

    if (hasTdScheduled) {
      convo.setVar('date', tdDate);
      convo.setVar('time', tdTime);

      convo.gotoThread('already_scheduled')
    } else {

      convo.setVar('_td_date', tdDate);
    }
    next();
  })

  //checks whether tomorrow's date is necessary for the test drive
  controller.studio.beforeThread('test_drive', 'td_time', async function(convo, next) {

    const tomorrow = tools.getTomorrowDate();
    const res = await knex.getUserData('td_date', convo.context.user);

    if (res.td_date == null) {
      convo.setVar('_td_date', tomorrow);
      await knex.update({td_date: tomorrow}, convo.context.user)
    }

    next();
  })

  controller.studio.before('lease', async function(convo, next) {

    const { lease_miles_per_year: leaseMilesPerYear,
            lease_total_driveoff: leaseTotalDriveoff,
            zipcode,
            current_finance_preference: currentFinancePreference
          } = await knex.getUserData(['lease_miles_per_year','lease_total_driveoff','zipcode', 'current_finance_preference'], convo.context.user);

    if (currentFinancePreference !== null) {
      if (currentFinancePreference === 'lease') {
        convo.setVar('miles_per_year', leaseMilesPerYear);
        convo.setVar('total_driveoff', leaseTotalDriveoff);
        convo.setVar('lease_zipcode', zipcode);
        convo.gotoThread('answered_leaseq');
      } else {
        convo.setVar('other_pay', currentFinancePreference);
        convo.gotoThread('other_plan');
      }
    }
    next();
  })

  controller.studio.before('cash', async function(convo, next) {

    const { zipcode,
            current_finance_preference: currentFinancePreference
          } = await knex.getUserData(['zipcode', 'current_finance_preference'], convo.context.user);

    if (currentFinancePreference !== null) {
      if (currentFinancePreference === 'cash') {
        convo.setVar('zipcode', res.zipcode);
        convo.gotoThread('answered_cashq');
      } else {
        convo.setVar('other_pay', currentFinancePreference);
        convo.gotoThread('other_plan');
      }
    }
    next();
  })

  controller.studio.before('finance', async function(convo, next) {

    const {finance_years: financeYears,
           finance_down: financeDown,
           zipcode,
           current_finance_preference: currentFinancePreference
         } = await knex.getUserData(['finance_years','finance_down','zipcode', 'current_finance_preference'], convo.context.user);

    if (currentFinancePreference !== null) {
      if (currentFinancePreference === 'finance') {
        convo.setVar('finance_years', financeYears);
        convo.setVar('finance_down', financeDown);
        convo.setVar('zipcode', zipcode);
        convo.gotoThread('answered_financeq');
      } else {
        convo.setVar('other_pay', currentFinancePreference);
        convo.gotoThread('other_plan');
      }
    }
    next();
  })

}
