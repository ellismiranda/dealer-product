//methods for formatting clapi calls

module.exports = {
  pull,
}

const request = require('../utils/uRequests');

//main method, returns JS object of data
async function pull(query) {
  const body = await clapi(query);
  const res = await request.getClapiData(body);
  const parsedRes = JSON.parse(res.text);
  return parsedRes.data;
}

//change the defaults so that it has all info for lease / finance to put on carousel card
function getDefaultRequest() {
  return {
    system: {
      _debug: false,
      userToken: "1f3870be274f6c49b3e31a0c6728957f"
    },
    constraints: {
      "year": {
        "from": 2016,
        "to": 2018
      }
    },
    score: {
      safety: 0,
      performance: 0,
      reliability: 0,
      economy: 0,
      fuelEconomy: 0,
      comfort: 0,
      utility: 0,
      environment: 0,
      luxury: 0,
      popularity: 1
    },
    fetch: {
      sort: 'overallScore',
      order: 'desc',
      distinct: 'model',
    },
    requesting: [
      "id",
      "make",
      "model",
      "year",
      "trim",
      "mpgCity",
      "mpgHighway",
      "sunroof",
      "overallScore",
      "exteriorColors",
      "images"
      // {
      //   "finance": {
      //     term_months: 24,
      //     annual_rate: 9.9,
      //     down_payment: 2000
      //   }
      // },

    ]
  };
}

async function clapi(query) {
  const request = await getDefaultRequest();
  const result = query.result;
  const car = result.parameters.car[0];
  if (car.make) request.constraints.make = [ car.make ];
  if (car.model) request.constraints.model = [ car.model ];
  if (car.year) request.constaints.year = car.year;

  return request;
}
