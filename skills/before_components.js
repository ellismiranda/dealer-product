module.exports = function(controller) {
  
// AN ATTEMPT AT GETTING THE USER'S FIRST NAME
//   controller.studio.before('Cara_welcome', function(convo, next) {

//     var request = require('request'); 
//     var senderId = convo.context.user;
    
//     request({
//       url: "https://graph.facebook.com/v2.6/" + senderId + "?fields=first_name&access_token=" + process.env.page_token,
//       json: true // parse
//     }, function(err, response, body) {
//       if (err) {
//         return err;
//       }
//       var first_name = JSON.parse(body).first_name;
//       var last_name = JSON.parse(body).last_name;

//       controller.storage.users.get(convo.context.user, function(err, user) {
//         user._first_name = first_name;
//         user._last_name = last_name;

//         controller.storage.users.save(user);

//       });
        
//     });
    
//     next();

//   });

  
  controller.studio.before('has_td_scheduled', function(convo, next) {
    
    controller.storage.users.get(convo.context.user, function(err, user) {
      
      convo.setVar('_td_date', user._td_date);
      convo.setVar('_td_time', user._td_time);
      convo.setVar('_location', user._location);
      
    })
    
    next();
  })
  
  controller.studio.before('lease', function(convo, next) {
    controller.storage.users.get(convo.context.user, function(err, user) {
      var answered_leaseq = user.lease.answered_leaseq;
      console.log(answered_leaseq);
      if (answered_leaseq) {
        convo.setVar('miles_per_year', user.lease.miles_per_year);
        convo.setVar('total_driveoff', user.lease.total_driveoff);
        convo.setVar('lease_zipcode', user.lease.lease_zipcode);
        console.log("set vars");
        convo.gotoThread('answered_leaseq');
        next();
      } else {
        
      }
    })
    
  })
  
  
}