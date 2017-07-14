/*
These .validate() calls catch specific variables in Studio scripts
and both set them so that threads can use them, and store them in the database.
*/

const knex = require('../utils/uKnex.js');

module.exports = function(controller) {

  controller.studio.validate('test_drive', '_td_date', async function(convo, next) {
    const tdDate = convo.extractResponse('_td_date');
    convo.setVar('_td_date', tdDate);

    await knex.update({td_date: tdDate, td_tomorrow: false}, convo.context.user);

    next();
  });

  controller.studio.validate('test_drive', '_td_time', async function(convo, next) {
    const tdTime = convo.extractResponse('_td_time');
    convo.setVar('_td_time', tdTime);

    await knex.update({td_time: tdTime, has_td_scheduled: true}, convo.context.user);

    next();
  });

  controller.studio.validate('phone_number', '_phone_number', async function(convo, next) {

    const phoneNumber = convo.extractResponse('_phone_number');
    convo.setVar('_phone_number', phoneNumber);

    await knex.update({phone_number: phoneNumber}, convo.context.user);

    next();
  })

  controller.studio.validate('get_correct_zip', '_correct_zip', async function(convo, next) {
    const correctZip = convo.extractResponse('_correct_zip');
    convo.setVar('_correct_zip', correctZip);

    await knex.update({zipcode: correctZip}, convo.context.user);

    next();
  })

  controller.studio.validate('different_car', 'other_car', async function(convo, next) {
    const otherCar = convo.extractResponse('other_car');
    convo.setVar('other_car', otherCar);

    await knex.update({other_car: otherCar}, convo.context.user);

    next();
  })

  controller.studio.validate('different_car', 'other_coloroptions', async function(convo, next) {
    const otherColorOptions = convo.extractResponse('other_coloroptions');
    convo.setVar('other_coloroptions', otherColorOptions);

    await knex.update({other_color_options: otherColorOptions}, convo.context.user);

    next();
  })

}
