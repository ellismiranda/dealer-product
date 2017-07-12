//random tool scripts*

//  *not partiularly useful yet

module.exports = {
  getTodayDate,
  getTomorrowDate,
  getTime
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
