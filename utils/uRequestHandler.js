//methods for handling request.group, request.details, etc.

module.exports = {
  requestGroup,
  requestDetails,
  choose,
}

const clapi = require('../utils/uClapi');

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
  return makeAttachment(makeGroupElements(data));
}

//Returns a single specific car's carousel element
async function requestDetails(query) {
  const data = await clapi.pull(query);
  let attachment = { };
  attachment = await makeAttachment(makeSingleElement(data[0].make, data[0].model, data[0].year, data[0].images[1].url));
  return attachment;
}

function makeSingleElement(make, model, year, imageUrl) {
  return [ makeElement(make, model, year, imageUrl)];
}

//Creates the 'elements' piece of the attachment for multiple cars
function makeGroupElements(cars) {
  const elements = [ ];
  for (var i = 0; i < cars.length && i < 10; i++) {
    let currentElement = makeElement(cars[i].make, cars[i].model, cars[i].year, cars[i].images[1].url)
    elements.push(JSON.stringify(currentElement));
  }
  return elements;
}

//Formats the entire attachment once passed the array of carousel elements
function makeAttachment(elements) {
  return {
      'type':'template',
      'payload':{
           'template_type':'generic',
           'elements': elements
      }
  }
}

//Formats a single carousel element
function makeElement(make, model, year, imageUrl) {
  const obj =
      {
      title: year + ' ' + make + ' ' + model,
      image_url: imageUrl,
      subtitle:'Lease now!',
      buttons:[
        {
          type:'postback',
          payload: ' ',
          title:'View Details'
        },
        {
          type:'postback',
          payload: ' ',
          title:'All ' + make + ' Offers',
        }
      ]
    };
    return obj;
}
