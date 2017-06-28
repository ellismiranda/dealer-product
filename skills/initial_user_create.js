module.exports = function(controller) {
  
  //defaulting that tomorrow works as a test drive date
  controller.studio.before('Cara_welcome', function(convo, next) {
    
    var today = new Date();
    var date = (today.getMonth() + 1) + '.' + (today.getDate()+1);
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      
      if (!user) {
        var user = {
          id: convo.context.user,
          currentCar: {
            name: '',
          },
          user: {
            name: '',
            email: '',
            phoneNumber: 0,
            zipcode: undefined,
            preferences: {
              safety: 0,
              performance: 0,
              reliability: 0,
              economy: 0,
              comfort: 0,
              utility: 0,
              environment: 0,
              luxury: 0,
              fuelEconomy: 0,
              popularity: 1,
            },
            userAgent: '',
            lastFinancePreference: undefined,
            currentFinancePreference: undefined,
          },
          lease: {
            miles_per_year: 0,
            total_driveoff: 0,
            lease_zipcode: 0,
            credit_score: 0,
          },
          quiz: {},
          bodyStyle: [],
          bodySize: [],
          bodyType: [],
          transcript: [],
          buttons: [],
          _td_tomorrow: true,
          _td_date: date,
          _has_td_scheduled: false,
        }
      }
      
      convo.setVar('_td_date', user._td_date);
      
      controller.storage.users.save(user);
      
      
    })
      
    next();
    
  });
  
}