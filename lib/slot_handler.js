'use strict';
var _ = require('lodash');

function SlotHelper() {
}

// FAADataHelper.prototype.requestAirportStatus = function(airportCode) {
//   return this.getAirportStatus(airportCode).then(
//     function(response) {
//       console.log('success - received airport info for ' + airportCode);
//       return response.body;
//     }
//   );
// };

SlotHelper.prototype.getUtterancesType = function(slots) {
  if(typeof slots.question === 'undefined'){
    // either 2 or 3
    if(typeof slots.status !== 'undefined'){
      return 2;
    }else if(typeof slots.resulttype !== 'undefined'){
      return 3;
    }
    return 4;
  }else if(typeof slots.teamB === 'undefined'){
    return 1;
  }else if(typeof slots.teamA !== 'undefined'){
      return 0;
  }
  return -1;
};

module.exports = SlotHelper;
