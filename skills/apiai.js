const apiaibotkit = require('api-ai-botkit-facebook');
const apiai = apiaibotkit(process.env.apiaiToken);

// SINGLE DOT = 'HERE'
// DOUBLE DOT = 'GO UP 1'
const clapi = require('../utils/uClapi.js');
const checks = require('../utils/uChecks.js');
const tools = require('../utils/uTools.js');
const handler = require('../utils/uRequestHandler.js');

const knex2 = require('../utils/uKnex.js');

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

  //Q: is there a way to check all other functions before this one?
  //everything said to the bot gets passed through apiai, unless it gets caught by a local script
   controller.hears('(.*)', 'message_received', function(bot, message) {
     console.log('Input message: ' + message.text);
     const [localCheckStatus, localPayload] = checks.localCheck(message.text);
     console.log('Local Check: ' + localCheckStatus);
     if (localCheckStatus === 'ERROR') {
       console.log('Sending to apiai...');
       apiai.process(message, bot);
     } else {
       console.log('Running Studio script...');
       controller.studio.run(bot, localPayload, message.user, message.channel);
     }
   })

  //produces a nice log of the result of .process(message)
  apiai.all(async function (message, resp, bot) {

    //logging the processed apiai info
    console.log("apiai result:");
    console.log(resp.result);
    console.log(resp.result.parameters);

    //log the date, time, message, and nlp response
    const currentTime = await tools.getTime();
    const currentDate = await tools.getTodayDate();

    const { id: userId } = await knex2.getUserData('id', message.user);
    const msgStr = message.text;
    const processedMsg = resp.result;

    await knex2.logMessage({user_id: userId,
                            msg_str: msgStr,
                            processed_nlp: processedMsg,
                            time: currentTime,
                            date: currentDate});
  })


  //.action() handlers follow
  apiai

  .action('hi.carla', async function(message, resp, bot) {
    controller.studio.run(bot, 'fb hello', message.user, message.channel);
  })

  //HEAVY TESTING - THIS NEEDS CLAPI IMPLEMENTED
  //this should give details about a car / show off the car
  .action('request.details', async function(message, resp, bot) {
    const replyAttachment = await handler.choose(resp);
    bot.reply(message, { attachment: replyAttachment, })
   })

   //pretty basic currently, returns multiple carousel elements
  .action('request.group', async function(message, resp, bot){
    const replyAttachment = await handler.choose(resp);
    bot.reply(message, { attachment: replyAttachment });
  })

  //changes the user's zipcode
  .action('change.zipcode', async function(message, resp, bot) {
    //checks if the user says that the zip isn't theirs
    if (resp.result.parameters.modifier == 'negation') {
      //runs a small botkit studio script to get a new zip
      controller.studio.run(bot, 'get_correct_zip', message.user, message.channel);
    } else {
      const result = resp.result;
      const parameters = result.parameters;
      const zipcode = parameters.zipcode;
      await knex2.update({zipcode: zipcode}, message.user);
      bot.reply(message, "Okay, I have changed your zipcode to " + resp.result.parameters.zipcode + ".");
    }
  })

  //modifies the user's preference score values based on what they say
  //e.g. "I only care about safety" => safety+1, rest-1
  //e.g. "I care about performance and utility" => performance+1, utility+1
  .action('change.preferences', async function(message, resp, bot) {
    const { requestedAttributes: reqAtts,
            modifier,
          } = resp.result.parameters;
    const { preferences, } = await knex2.getUserData('preferences', message.user);
    const newPrefs = await tools.adjustPrefs(preferences, reqAtts, modifier);

    await knex2.update({preferences: newPrefs}, message.user);

    bot.reply(message, "Okay, I will adjust car selection accordingly.");
  })

  .action('schedule.testDrive', async function(message, resp, bot) {
    const { has_td_scheduled: hasTdScheduled } = await knex2.getUserData('has_td_scheduled', message.user);
    const { make } = resp.result.parameters;

    if (hasTdScheduled) {
      controller.studio.run(bot, 'has_td_scheduled', message.user, message.channel);
    } else {
      if (make !== '') {
        await knex2.update({td_car_make: make}, message.user)
      }

      controller.studio.run(bot, 'test_drive', message.user, message.channel);
    }
  })

  // //standard response message in the case of
  .action('input.unknown', function (message, resp, bot) {
    bot.reply(message, resp.result.fulfillment.speech);
  })

  //CATCH-ALL: WILL RUN ANYTHING THROUGH STUDIO THAT A .action() HANDLER DOESN'T EXIST FOR
  .action(null, function(message, resp, bot) {
    console.log("Running catch-all..");
    controller.studio.runTrigger(bot, resp.result.fulfillment.speech, message.user, message.channel);
  });

}
