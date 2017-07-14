const request = require('../utils/uRequests.js');
const knex = require('../utils/uKnex.js');

module.exports = function(controller) {

  //defaulting that tomorrow works as a test drive date
  controller.studio.before('Cara_welcome', async function(convo, next) {

    const res = await knex.getUserData(['uuid', 'first_name', 'last_name'], convo.context.user);

    if (res === undefined) {
      const data = await request.getFbData(convo.context.user);
      const { first_name: firstName,
              last_name: lastName,
              gender,
            } = await JSON.parse(data.res.text);

      knex.insert({
        uuid: convo.context.user,
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        email: '',
        phone_number: '',
        zipcode: null,
        credit_score: null,
        td_tomorrow: true,
        td_date: null,
        has_td_scheduled: false
      }, convo.context.user);

      convo.setVar('firstName', firstName);
    } else {
      //leave this as res.first_name since it's a single call
      convo.setVar('firstName', res.first_name);
    }
    next();
  });
}
