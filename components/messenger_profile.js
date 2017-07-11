var debug = require('debug')('botkit:messenger_profile');

module.exports = function(controller) {

    debug('Configuring Facebook thread settings...');
    controller.api.messenger_profile.greeting('Hello! I\'m a Botkit bot!');
    controller.api.messenger_profile.get_started('Cara_welcome');
    controller.api.messenger_profile.menu([
    {
        "locale":"default",
        "composer_input_disabled":true,
        "call_to_actions":[
            {
                "title":"Options",
                "type":"nested",
                "call_to_actions":[
                  {
                    "title":"Reset",
                    "type":"postback",
                    "payload":"Cara_welcome"
                  }
                ]
            },
            {
                "type":"web_url",
                "title":"Botkit Docs",
                "url":"https://github.com/howdyai/botkit/blob/master/readme-facebook.md",
                "webview_height_ratio":"full"
            }
        ]
    },
    {
        "locale":"zh_CN",
        "composer_input_disabled":false
    }
]);

}
