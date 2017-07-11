//methods for handling request.group, request.details, etc.

module.exports = {
  requestGroup,
  requestDetails,
  choose,
}

var clapi = require('../utils/uClapi');

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
  var data = await clapi.pull(query);
  return makeAttachment(makeGroupElements(data));
}

//Returns a single specific car's carousel element
async function requestDetails(query) {
  var data = await clapi.pull(query);
  var attachment = { };
  attachment = await makeAttachment(makeElement(data[0].make, data[0].model, data[0].year, data[0].images[1].url));
  return attachment;
}

//Creates the 'elements' piece of the attachment for multiple cars
function makeGroupElements(cars) {
  var elements = [ ];
  for (var i = 0; i < cars.length && i < 5; i++) {
    elements.push(makeElement(cars[i].make, cars[i].model, cars[i].year, cars[i].images[1].url));
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
function makeElement(make, model, year,imageUrl) {
  return [
      {
      'title': year + ' ' + make + ' ' + model,
      'image_url': imageUrl,
      'subtitle':'Lease now!',
      'buttons':[
        {
          'type':'postback',
          'payload': ' ',
          'title':'View Details'
        },
        {
          'type':'postback',
          'payload': ' ',
          'title':'All ' + make + ' Offers',
        }
      ]
    }
  ];
}

// function detailsFormat(make, model, year, imageUrl) {
//   var attachment = {
//       'type':'template',
//       'payload':{
//            'template_type':'generic',
//            'elements':[
//              {
//                'title': year + ' ' + make + ' ' + model,
//                'image_url': imageUrl,
//                'subtitle':'Lease now!',
//                'buttons':[
//                  {
//                    'type':'postback',
//                    'payload': ' ',
//                    'title':'View Details'
//                  },
//                  {
//                    'type':'postback',
//                    'payload': ' ',
//                    'title':'All ' + make + ' Offers',
//                  }
//                ]
//              }
//            ]
//          }
//        }
//        return attachment;
// }
