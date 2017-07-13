/*
These .validate() calls catch specific variables in Studio scripts
and both set them so that threads can use them, and store them in the database.
*/

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

  controller.studio.validate('test_drive', '_location', function(convo, next) {
    const location = convo.extractResponse('_location');
    convo.setVar('_location', location);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('location', location)
        .then(function() { });
    next();
  });

  controller.studio.validate('test_drive', '_td_date', function(convo, next) {
    //this date comes out URI encoded when using mm/dd ?
    const tdDate = convo.extractResponse('_td_date');
    convo.setVar('_td_date', tdDate);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('td_date', tdDate)
        .then(function(res) {
          if (_td_date) {
            knex.table('users')
                .where('uuid', convo.context.user)
                .update('td_tomorrow', false)
                .then(function() { });
          }
        });
    next();
  });

  controller.studio.validate('test_drive', '_td_time', function(convo, next) {
    const tdTime = convo.extractResponse('_td_time');
    convo.setVar('_td_time', tdTime);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update({td_time: tdTime, has_td_scheduled: true})
        .then(function(res) { });
    next();
  });

  controller.studio.validate('phone_number', '_phone_number', function(convo, next) {
    const phoneNumber = convo.extractResponse('_phone_number');
    convo.setVar('_phone_number', phoneNumber);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('phone_number', phoneNumber)
        .then(function() { });
    next();
  })

  controller.studio.validate('get_correct_zip', '_correct_zip', function(convo, next) {
    const correctZip = convo.extractResponse('_correct_zip');
    convo.setVar('_correct_zip', correctZip);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('zipcode', correctZip)
        .then(function() { });
    next();
  })

  controller.studio.validate('different_car', 'other_car', function(convo, next) {
    const otherCar = convo.extractResponse('other_car');
    convo.setVar('other_car', otherCar);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('other_car', otherCar)
        .then(function() { });
    next();
  })

  controller.studio.validate('different_car', 'other_coloroptions', function(convo, next) {
    const otherColorOptions = convo.extractResponse('other_coloroptions');
    convo.setVar('other_coloroptions', otherColorOptions);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('other_color_options', otherColorOptions)
        .then(function() { });
    next();
  })

}
