//random tool scripts

module.exports = {
  getTodayDate,
  getTomorrowDate,
  getTime,
  makeAttachment,
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

//Creates the 'elements' piece of the attachment for multiple cars
function makeGroupElements(cars) {
  const elements = [ ];
  for (let i = 0; i < cars.length && i < 10; i++) {
    const {make, model, year, images} = cars[i];
    
    //TED IS A GENIUS
    const filterImages = images.filter(img => img.type === 'frontQuarter')
    const secondFilterImages = (filterImages.length > 0) ? filterImages[0] : images[0];
    const finalImage = secondFilterImages ? secondFilterImages : {url: ''};

    const currentElement = makeElement(make, model, year, finalImage.url)
    elements.push(currentElement);
  }
  return elements;
}

//Formats the entire attachment once passed the array of carousel elements
async function makeAttachment(cars) {
  const elements = await makeGroupElements(cars);
  return {
      type:'template',
      payload:{
           template_type:'generic',
           elements: elements,
      }
  }
}

//Formats a single carousel element
function makeElement(make, model, year, imageUrl) {
  return {
      title: `${year} ${make} ${model}`,
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
          title:`All ${make} Offers`,
        }
      ]
    };
}
