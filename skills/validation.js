/*
These .validate() calls catch specific variables in Studio scripts
and both set them so that threads can use them, and store them in the database.
*/

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

  controller.studio.validate('test_drive', '_location', function(convo, next) {
    var _location = convo.extractResponse('_location');
    convo.setVar('_location', _location);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('location', _location)
        .then(function() { });
    next();
  });

  controller.studio.validate('test_drive', '_td_date', function(convo, next) {
    //this date comes out URI encoded when using mm/dd ?
    var _td_date = convo.extractResponse('_td_date');
    convo.setVar('_td_date', _td_date);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('tdDate', _td_date)
        .then(function(res) {
          if (_td_date) {
            knex.table('users')
                .where('uuid', convo.context.user)
                .update('tdTomorrow', false)
                .then(function() { });
          }
        });
    next();
  });

  controller.studio.validate('test_drive', '_td_time', function(convo, next) {
    var _td_time = convo.extractResponse('_td_time');
    convo.setVar('_td_time', _td_time);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update({tdTime: _td_time, hasTdScheduled: true})
        .then(function(res) { });
    next();
  });

  controller.studio.validate('phone_number', '_phone_number', function(convo, next) {
    var _phone_number = convo.extractResponse('_phone_number');
    convo.setVar('_phone_number', _phone_number);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('phoneNumber', _phone_number)
        .then(function() { });
    next();
  })

  controller.studio.validate('get_correct_zip', '_correct_zip', function(convo, next) {
    var _correct_zip = convo.extractResponse('_correct_zip');
    convo.setVar('_correct_zip', _correct_zip);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('zipcode', _correct_zip)
        .then(function() { });
    next();
  })

  controller.studio.validate('different_car', 'other_car', function(convo, next) {
    var other_car = convo.extractResponse('other_car');
    convo.setVar('other_car', other_car);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('otherCar', other_car)
        .then(function() { });
    next();
  })

  controller.studio.validate('different_car', 'other_coloroptions', function(convo, next) {
    var other_coloroptions = convo.extractResponse('other_coloroptions');
    convo.setVar('other_coloroptions', other_coloroptions);
    knex.table('users')
        .where('uuid', convo.context.user)
        .update('otherColorOptions', other_coloroptions)
        .then(function() { });
    next();
  })

}
