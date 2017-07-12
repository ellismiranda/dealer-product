var request = require('../utils/uRequests.js');

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

  //defaulting that tomorrow works as a test drive date
  controller.studio.before('Cara_welcome', async function(convo, next) {

    var today = new Date();
    var date = (today.getMonth() + 1) + '.' + (today.getDate()+1) + '.' + (today.getFullYear());

    knex.table('users').where('uuid', convo.context.user).first('uuid', 'firstName', 'lastName').then(async function(res) {
      if (res === undefined) {

        var userData = await request.getFbData(convo.context.user);
        userData = JSON.parse(userData.res.text);

        knex.table('users').insert({
          uuid: convo.context.user,
          firstName: userData.first_name,
          lastName: userData.last_name,
          gender: userData.gender,
          email: '',
          phoneNumber: '',
          zipcode: null,
          creditScore: null,
          tdTomorrow: true,
          tdDate: date,
          hasTdScheduled: false
        })
        .then(function() { });

        convo.setVar('firstName', userData.first_name);
      } else {
        convo.setVar('firstName', res.firstName);
      }
    })
    next();
  });
}

// x = res;
// if (x == undefined) {
//   var user = {
//     id: convo.context.user,
//     currentCar: {
//       name: '',
//     },
//     user: {
//       name: '',
//       email: '',
//       phoneNumber: null,
//       zipcode: null,
//       credit_score: null,
//       preferences: {
//         safety: 0,
//         performance: 0,
//         reliability: 0,
//         economy: 0,
//         comfort: 0,
//         utility: 0,
//         environment: 0,
//         luxury: 0,
//         fuelEconomy: 0,
//         popularity: 1,
//       },
//       userAgent: '',
//       lastFinancePreference: '',
//       currentFinancePreference: '',
//     },
//     payment_option: '',
//     lease: {
//       miles_per_year: 0,
//       total_driveoff: 0,
//     },
//     finance: {
//       finance_years: 0,
//       finance_down: 0,
//     },
//     quiz: {},
//     bodyStyle: [],
//     bodySize: [],
//     bodyType: [],
//     transcript: [],
//     buttons: [],
//     _td_tomorrow: true,
//     _td_date: date,
//     _has_td_scheduled: false,
//     other_car: '',
//     other_coloroptions: '',
//   }
//   knex.table('users').insert({uuid: convo.context.user, userdata: user}).then(function() { });
// }
