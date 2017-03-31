'use strict';
//past match/serie
// "Did [team] win?"
// "Who won the [team or event] game?"
// "What is the score of the [team name] game?"
var OPENDOTAHelper = require('../lib/opendota_helper');
let pastSerieIntent = [{
  'slots': {
    'TEAMA': 'TEAM',
    'TEAMB': 'TEAM',
  },
  'utterances': [
      '{|what|how} {|is|are} {|the} past {|performance|encounter} between {-|TEAMA} and {-|TEAMB}',

  ]

},function(req, res){
  var teamA = req.slot('TEAMA');
  var teamB = req.slot('TEAMB');
  var openDotaHelper = new OPENDOTAHelper();
  return openDotaHelper.getTeams().then(function(teams){
    var teamAId = openDotaHelper.getTeamByTeamName(teams,teamA);
    var teamBId = openDotaHelper.getTeamByTeamName(teams, teamB);
    return openDotaHelper.getPassEncouter(teamAId.team_id,teamBId.team_id).then(function(matches){
      var numberOfTeamAWin = matches.rows.reduce(function(total, match, currentIndex, arr){
          if(match.radiant_team_id === teamAId.team_id ){
            if(match.radiant_win){
              total++;
            }
          }else{
            if(!match.radiant_win){
              total++;
            }
          }
          return total;
      },0);
      res.say('Team '+teamA+' win '+numberOfTeamAWin+' out of last '+matches.rowCount+ ' games');
    });
  });
}];
module.exports = pastSerieIntent;
