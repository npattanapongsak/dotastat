'use strict';
//past match/serie
// "Did [team] win?"
// "Who won the [team or event] game?"
// "What is the score of the [team name] game?"
var OPENDOTAHelper = require('../lib/opendota_helper');
let pastSerieIntent = [{
  'slots': {
    'TEAMA': 'TEAM'
  },
  'utterances': [

    'Did {-|TEAMA} win',
    'Who won {|the} {-|TEAMA} game',
    "What {|is} the score of {|the} {-|TEAMA} game?",
    "{|team} {-|TEAMA} recent results"
  ]

},function(req, res){
  var teamA = req.slot('TEAMA');
  var openDotaHelper = new OPENDOTAHelper();
  return openDotaHelper.getTeams().then(function(teams){
    console.log(teams);
    var teamAId = openDotaHelper.getTeamByTeamName(teams,teamA);

    return openDotaHelper.getTeamSeries(teamAId.team_id,1).then(function(series){
      let verb = "win";
      if(series[0].win < series[0].lost){
        verb ='lost';
      }else if(series[0].win == series[0].lost){
        verb ='draw';
      }
      res.say(`${teamA} ${verb} ${series[0].win}-${series[0].lost} against ${series[0].opponentName} at ${series[0].leaguename}`);
    });
  });
}];
module.exports = pastSerieIntent;
