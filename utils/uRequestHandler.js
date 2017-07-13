//methods for handling request.group, request.details, etc.

module.exports = {
  choose,
}

const clapi = require('../utils/uClapi.js');
const tools = require('../utils/uTools.js');

//**THIS WORKS WHILE CLAPI IS FETCHING DISTINCT MODELS**
//**SO WRITE SOME DYNAMIC CLAPI FUNCTIONS**
async function choose(query) {  //this should decide if it's a single car or a request for multiple
  const data = await clapi.pull(query);
  return tools.makeAttachment(data);
}
