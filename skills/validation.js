/*
These .validate() calls catch specific variables in Studio scripts
and both set them so that threads can use them, and store them in the database.
*/
module.exports = function(controller) {

  controller.studio.validate('test_drive', '_location', function(convo, next) {
    
    var _location = convo.extractResponse('_location');
    convo.setVar('_location', _location);
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      
      user._location = _location;
      
      controller.storage.users.save(user);
      
    });
    
    next();
    
  });
  
  controller.studio.validate('test_drive', '_td_date', function(convo, next) {
    
    //this date comes out URI encoded when using mm/dd ?
    var _td_date = convo.extractResponse('_td_date');
    convo.setVar('_td_date', _td_date);
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      
      user._td_date = _td_date;
      
      if (_td_date) {
        user._td_tomorrow = false;
      }
      
      controller.storage.users.save(user);
      
    });
    
    next();
    
  });
  
  controller.studio.validate('test_drive', '_td_time', function(convo, next) {
    
    var _td_time = convo.extractResponse('_td_time');
    convo.setVar('_td_time', _td_time);
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      
      user._td_time = _td_time;
      
      user._has_td_scheduled = true;
      
      controller.storage.users.save(user);
      
    });
    
    next();
    
  });
  
  controller.studio.validate('phone_number', '_phone_number', function(convo, next) {
    
    var _phone_number = convo.extractResponse('_phone_number');
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      
      user.user.phoneNumber = _phone_number;
      
      controller.storage.users.save(user);
      
    });
    
    next();
    
  })
  
  controller.studio.validate('get_correct_zip', '_correct_zip', function(convo, next) {
    
    var _correct_zip = convo.extractResponse('_correct_zip');
    convo.setVar('_correct_zip', _correct_zip);
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      
      user.user.zipcode = _correct_zip;
      
      controller.storage.users.save(user);
      
    })
    
    next();
    
  })
  
  controller.studio.validate('different_car', 'other_car', function(convo, next) {
    var other_car = convo.extractResponse('other_car');
    convo.setVar('other_car', other_car);
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      user.other_car = other_car;
      controller.storage.users.save(user);
    })
    next();
  })
  
  controller.studio.validate('different_car', 'other_coloroptions', function(convo, next) {
    var other_coloroptions = convo.extractResponse('other_coloroptions');
    convo.setVar('other_coloroptions', other_coloroptions);
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      user.other_coloroptions = other_coloroptions;
      controller.storage.users.save(user);
    })
    next();
  })
  
}