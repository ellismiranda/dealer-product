//methods for handling request.group, request.details, etc.

module.exports = {
  requestGroup,
  requestDetails,
  choose,
}

const clapi = require('../utils/uClapi.js');
const tools = require('../utils/uTools.js');

async function choose(query) {  //this should decide if it's a single car or a request for multiple
  if (query.result.parameters.car.length == 1 && query.result.parameters.car[0].model) { //if it has a single request and it has a model
    console.log("Finding details...");
    return requestDetails(query);
  } else {  //otherwise send to group
    console.log("Finding group...");
    return requestGroup(query);
  }
}

//this should decide if its more than one specific models, or a group of cars
async function requestGroup(query) {
  const data = await clapi.pull(query);
  return tools.makeAttachment(tools.makeGroupElements(data));
}

//Returns a single specific car's carousel element
async function requestDetails(query) {
  const data = await clapi.pull(query);
  return await tools.makeAttachment(tools.makeSingleElement(data[0].make, data[0].model, data[0].year, data[0].images[1].url));
}
