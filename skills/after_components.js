module.exports = function(controller) {

  controller.studio.after('lease', function(convo, next) {   
    var vars = convo.extractResponses();
    controller.storage.users.get(convo.context.user, function(err, user) {
      user.lease.miles_per_year = vars.miles_per_year;
      user.lease.total_driveoff = vars.total_driveoff;
      user.user.zipcode = vars.lease_zipcode;
      user.user.credit_score = vars.credit_score;
      user.answered_leaseqs = true;
      controller.storage.users.save(user);
    })
    next();
  })
  
  controller.studio.after('cash', function(convo, next) {   
    var vars = convo.extractResponses();
    controller.storage.users.get(convo.context.user, function(err, user) {
      user.user.zipcode = vars.zipcode;
      user.answered_cashqs = true;
      controller.storage.users.save(user);
    })
    next();
  })
  
  controller.studio.after('finance', function(convo, next) {   
    var vars = convo.extractResponses();
    controller.storage.users.get(convo.context.user, function(err, user) {
      user.finance.finance_years = vars.finance_years
      user.finance.finance_down = vars.finance_down;
      user.user.zipcode = vars.lease_zipcode;
      user.user.credit_score = vars.credit_score;
      user.answered_financeqs = true;
      controller.storage.users.save(user);
    })
    next();
  })


}