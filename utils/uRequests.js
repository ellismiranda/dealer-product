//methods for api calls

module.exports = {
  getFbData,
  getGalpinData,
  getClapiData,
}

var request = require('superagent');

function getFbData(id) {
  var url = "https://graph.facebook.com/v2.6/" + id + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + process.env.page_token;
  return request.get(url);
}

function getGalpinData() {
  return request.get("http://inventory-env.us-east-1.elasticbeanstalk.com/api?query={vehicles(make:\"ford\", model:\"fiesta\" limit: 100){id,year,make,model,trim,price,image,drivetrain,engine,exterior_color,interior_color,transmission,seller_notes,mileage}}")
}

function getClapiData(body) {
  return request
    .post('http://clapper-prod.us-east-1.elasticbeanstalk.com/clapi/clql-api/query')
    .send(body);
}
