//random tool scripts*

//  *not partiularly useful yet

module.exports = {
  getTodayDate,
  getTomorrowDate,
  getTime,
  makeSingleElement,
  makeGroupElements,
  makeAttachment,
  makeElement
}

function getTodayDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const today = `${month}.${day}.${year}`
  return today;
}

function getTomorrowDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate() + 1;
  const year = date.getFullYear();
  const tomorrow = `${month}.${day}.${year}`
  return tomorrow;
}

function getTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const time = `${hours}:${minutes}:${seconds}`;
  return time;
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
