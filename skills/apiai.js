const apiaibotkit = require('api-ai-botkit-facebook');
const apiai = apiaibotkit(process.env.apiaiToken);

// SINGLE DOT = 'HERE'
// DOUBLE DOT = 'GO UP 1'
const clapi = require('../utils/uClapi.js');
const checks = require('../utils/uChecks.js');
const tools = require('../utils/uTools.js');
const handler = require('../utils/uRequestHandler.js');

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
  apiai.all(function (message, resp, bot) {

    console.log("apiai result:");
    console.log(resp.result);
    console.log(resp.result.parameters);

    const currentTime = tools.getTime();
    const currentDate = tools.getTodayDate();

    //log the date, time, message, and nlp response
    knex.table('users')
        .where('uuid', message.user)
        .first('id')
        .then(function(res) {
          knex.table('messages')
              .insert({userId: res.id,
                      msgStr: message.text,
                      processedNLP: resp.result,
                      time: currentTime,
                      date: currentDate})
              .then(function() { });
        });
  })


  //.action() handlers follow
  apiai

  .action('hi.carla', async function(message, resp, bot) {
    clapi.clapi(resp);
  })

  //HEAVY TESTING - THIS NEEDS CLAPI IMPLEMENTED
  //this should give details about a car / show off the car
  .action('request.details', async function(message, resp, bot) {
    const replyAttachment = await handler.choose(resp);
    bot.reply(message, {
      attachment: replyAttachment,
    })
   })

   //pretty basic currently, returns multiple carousel elements
  .action('request.group', async function(message, resp, bot){
    const replyAttachment = await handler.choose(resp);
    bot.reply(message, { attachment: replyAttachment});
  })

  //changes the user's zipcode
  .action('change.zipcode', function(message, resp, bot) {
    //checks if the user says that the zip isn't theirs
    if (resp.result.parameters.modifier == 'negation') {
      //runs a small botkit studio script to get a new zip
      controller.studio.run(bot, 'get_correct_zip', message.user, message.channel);
    } else {
      knex.table('users')
        .where('uuid', message.user)
        .first('zipcode')
        .update('zipcode', resp.result.parameters.zipcode)
        .then(function(){ });
      bot.reply(message, "Okay, I have changed your zipcode to " + resp.result.parameters.zipcode + ".");
    }
  })

  //modifies the user's preference score values based on what they say
  //e.g. "I only care about safety" => safety+1, rest-1
  //e.g. "I care about performance and utility" => performance+1, utility+1
  .action('change.preferences', function(message, resp, bot) {
    //grab the preferences
    const reqAtts = resp.result.parameters.requestedAttributes;
    //grab the language modifier
    const modifier = resp.result.parameters.modifier;

    knex.table('users').where('uuid', message.user).first('preferences').then(function(res) {
      const newPrefs = res.preferences;
      let pref;
      for (pref in newPrefs) {
        if (modifier == 'singular') {
          if (reqAtts.indexOf(pref) > -1) {
              newPrefs[pref] = newPrefs[pref] + 1;
          } else {
            newPrefs[pref] = newPrefs[pref] - 1;
          }
        } else if (modifier == 'negation') {
          if (reqAtts.indexOf(pref) > -1) {
            newPrefs[pref] = newPrefs[pref] - 1;
          }
        } else {
          if (reqAtts.indexOf(pref) > -1) {
            newPrefs[pref] = newPrefs[pref] + 1;
          }
        }
      }
      knex.table('users').where('uuid', message.user).update({preferences: newPrefs}).then(function() { });
    })
    bot.reply(message, "Okay, I will adjust car selection accordingly.");
  })

  .action('schedule.testDrive', function(message, resp, bot) {
    knex.table('users')
        .where('uuid', message.user)
        .first('hasTdScheduled')
        .then(function(res) {
          if (res.hasTdScheduled) {
            controller.studio.run(bot, 'has_td_scheduled', message.user, message.channel);
          } else {
            if (resp.result.parameters.car[0].make !== '') {
              knex.table('users')
                  .where('uuid', message.user)
                  .first('hasTdScheduled')
                  .update('tdCarMake', resp.result.parameters.car[0].make)
                  .then(function(res) { });
            }
            controller.studio.run(bot, 'test_drive', message.user, message.channel);
          }
        });
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
