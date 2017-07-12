//list of localChecks for running Studio scripts

module.exports = {
  localCheck,
}

function localCheck(txt) {
  var isLocal = false;
  var toDeliver = null;
  console.log('checking locally..');
  LOCAL_CHECKS.forEach((check) => {
    if (txt.toLowerCase() === check.trigger) {
      isLocal = true;
      toDeliver = check.payload;
    }
  });
  if (txt.includes('_details') || txt.includes('_gallery')) {
    isLocal = true;
  }
  if (!isLocal) {
    return ['ERROR', null];
  }
  return ['OK', toDeliver];
}

//todo : make this into a list of strings instead of objects
const LOCAL_CHECKS = [
  {
    trigger: "cara_welcome",
    payload: "Cara_welcome"
  }, {
    trigger: "uptime",
    payload: "uptime"
  }, {
    trigger: "debug",
    payload: "uptime"
  }, {
    trigger: "different_car",
    payload: "different_car"
  },{
    trigger: "lease",
    payload: "lease"
  }, {
    trigger: "finance",
    payload: "finance"
  }, {
    trigger: "cash_purchase",
    payload: "cash"
  }, {
    trigger: "test_drive",
    payload: "test_drive"
  }, {
    trigger: "live_chat",
    payload: "live_chat"
  }, {
    trigger: "cry",
    payload: "cry",
  }, {
    trigger: "fb hello",
    payload: "fb hello",
  }, {
    trigger: "audi_a3",
    payload: "audi_a3",
  }, {
    trigger: "has_td_scheduled",
    payload: "has_td_scheduled"
  }, {
    trigger: "how_this_works",
    payload: "how_this_works"
  }, {
    trigger: "deals_gallery",
    payload: "deals_gallery"
  }

]
