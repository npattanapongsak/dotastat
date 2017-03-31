'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var  config = require('../data/config');

function DotaHelper() {
}

DotaHelper.prototype.getUpcommingMatches = function(teamId) {
  var options = {
    method: 'GET',
    uri: `https://www.thaitoday.net/schedule.json`,
    json: true
  };
  return rp(options).then(function(result){
    //console.log(result,'tt');
    return new Promise(function(resolve,reject){
      if(typeof teamId === 'undefined'){
        console.log(result);
        resolve(result.games);
      }else{
        let games = [];
        result.games.forEach(function(game){
          console.log(teamId,game.team1.team_id,game.team2.team_id)
          if(game.team1.team_id === teamId || game.team2.team_id === teamId){
            games.push(game);
          }
        });
        console.log(games);
        resolve(games);
      }
    });

  });


};
module.exports = DotaHelper;
