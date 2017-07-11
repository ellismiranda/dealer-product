//random tool scripts*

//  *not partiularly useful yet

module.exports = {
  cFormatter,
}

function cFormatter(make, model, year, image_url) {
  var attachment = {
      'type':'template',
      'payload':{
           'template_type':'generic',
           'elements':[
             {
               'title': year + ' ' + make + ' ' + model,
               'image_url': image_url,
               'subtitle':'Lease now!',
               'buttons':[
                 {
                   'type':'postback',
                   'payload': '',
                   'title':'View Details'
                 },
                 {
                   'type':'postback',
                   'payload': '',
                   'title':'All ' + make + ' Offers',
                 }
               ]
             },
           ]
         }
       }
       return attachment;
}
