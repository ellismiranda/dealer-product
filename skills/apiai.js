

var apiaibotkit = require('api-ai-botkit-facebook');
var apiai = apiaibotkit(process.env.apiaiToken);

module.exports = function(controller) {
  
  //everything said to the bot gets passed through apiai, unless it gets caught by a local script
   controller.hears('(.*)', 'message_received', function(bot, message) {
     const [localCheckStatus, localPayload] = localCheck(message.text);
     if (localCheckStatus === 'ERROR') {
       apiai.process(message, bot);
     } else {
       controller.studio.run(bot, localPayload, message.user, message.channel);
     }
   })
  
  //produces a nice log of the result of .process(message)
  apiai.all(function (message, resp, bot) {
    console.log(resp.result);
    console.log(resp.result.parameters);
    console.log(resp.result.action);
  })
  
  
  //.action() handlers follow
  apiai
  
  .action('hi.carla', function(message, resp, bot) {
    controller.studio.run(bot, 'fb hello', message.user, message.channel);
  })
  
  .action('change.zipcode', function(message, resp, bot) {
    //checks if the user says that the zip isn't theirs
    if (resp.result.parameters.modifier == 'negation') {
      //runs a small botkit studio script to get a new zip
      controller.studio.run(bot, 'get_correct_zip', message.user, message.channel);
    } else {
      //otherwise store the zip
      controller.storage.users.get(message.user, function(err, user) {
        user.user.zipcode = resp.result.parameters.zipcode;
        controller.storage.users.save(user);
      })
      bot.reply(message, "Okay, I have changed your zipcode to " + resp.result.parameters.zipcode + ".");
    }
  })
  
  .action('change.preferences', function(message, resp, bot) {
    
    //grab the preferences
    var reqAtts = resp.result.parameters.requestedAttributes;
    //grab the language modifier
    var modifier = resp.result.parameters.modifier;

    controller.storage.users.get(message.user, function(err, user) {
      
      //grab the user's preferences
      var newPrefs = user.user.preferences;
      
      var pref;
      
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
      
      controller.storage.users.save(user);
      
    });
    
    
  })
  
  .action('request.group', function(message, resp, bot){ 
    bot.reply(message, 'I don\'t have a database :(');
    //do some database grabbing here
  })
  
  .action('schedule.testDrive', function(message, resp, bot) {
    controller.storage.users.get(message.user, function(err, user) {
      //checks if the user already has a test drive scheduled
      if (user._has_td_scheduled) {
        //runs a specific Studio script if it does
        controller.studio.run(bot, 'has_td_scheduled', message.user, message.channel);
      } else {
        //otherwise it sets the car
        user._td_car = resp.result.parameters.car;
        //and runs the standard test_drive script
        controller.studio.run(bot, 'test_drive', message.user, message.channel);
      }
    })
  })
  
  // //standard response message in the case of 
  .action('input.unknown', function (message, resp, bot) {
    bot.reply(message, resp.result.fulfillment.speech);
    // controller.studio.runTrigger(bot, message.text, message.user, message.channel);
  })
  //CATCH-ALL: WILL RUN ANYTHING THROUGH STUDIO THAT A .action() HANDLER DOESN'T EXIST FOR
  .action(null, function(message, resp, bot) {
    console.log("..catch all..");
    //USE
//    controller.studio.run(bot, resp.result.fulfillment.speech, message.user, message.channel);
    //OR
    controller.studio.runTrigger(bot, resp.result.fulfillment.speech, message.user, message.channel);
  });
  
}

function localCheck(txt) {
  
  var isLocal = false;
  
  var toDeliver = null;
  
  LOCAL_CHECKS.forEach((check) => {
    console.log('checking..');
    if (txt.toLowerCase() === check.trigger) {
      isLocal = true;
      toDeliver = check.payload;
    }
  });
  
  if (!isLocal) {
    return ['ERROR', null];
  }
  return ['OK', toDeliver];
}

const LOCAL_CHECKS = [
  {
    trigger: "cara_welcome",
    payload: "Cara_welcome"
  }, {
    trigger: "uptime",
    payload: "uptime"
  }, {
    trigger: "debug",
    payload: "uptime"
  }, {
    trigger: "different_car",
    payload: "different_car"
  },{
    trigger: "lease",
    payload: "lease"
  }, {
    trigger: "finance",
    payload: "finance"
  }, {
    trigger: "cash_purchase",
    payload: "cash_purchase"
  }, {
    trigger: "test_drive",
    payload: "test_drive"
  }, {
    trigger: "live_chat",
    payload: "live_chat"
  }
  
]