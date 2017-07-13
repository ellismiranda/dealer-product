const request = require('../utils/uRequests.js');

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

  //defaulting that tomorrow works as a test drive date
  controller.studio.before('Cara_welcome', async function(convo, next) {

    knex.table('users').where('uuid', convo.context.user).first('uuid', 'first_name', 'last_name').then(async function(res) {
      if (res === undefined) {

        const data = await request.getFbData(convo.context.user);
        const userData = JSON.parse(data.res.text);

        knex.table('users').insert({
          uuid: convo.context.user,
          first_name: userData.first_name,
          last_name: userData.last_name,
          gender: userData.gender,
          email: '',
          phone_number: '',
          zipcode: null,
          credit_score: null,
          td_tomorrow: true,
          td_date: null,
          has_td_scheduled: false
        })
        .then(function() { });

        convo.setVar('firstName', userData.first_name);
      } else {
        convo.setVar('firstName', res.first_name);
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
