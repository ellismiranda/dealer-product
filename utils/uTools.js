//random tool scripts*

//  *not partiularly useful yet

module.exports = {
  getTomorrowDate,
}

function getTomorrowDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate() + 1;
  const year = date.getFullYear();
  const tomorrow = '${month}.${day}.${year}'
  return tomorrow;
}
