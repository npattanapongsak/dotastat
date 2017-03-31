//live matches
/*

http://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v1?key=03953ECF4F671B4DBD31B98B45FA39FC&start_at_team_id=39&teams_requested=1
*/
'use strict';
 var OPENDOTAHelper = require('../lib/opendota_helper');
 var SteamHelper = require('../lib/steam_helper');
let teamInfoIntent = [{
  'slots': {
    'TEAMA': 'TEAM'
  },
  'utterances': [
      '{|tell} {|me} about {-|TEAMA}',
      '{|what} {|is} {-|TEAMA}'

  ]
},function(req, res){
  const teamA = req.slot('TEAMA');
  var steamHelper = new SteamHelper();
  var openDotaHelper = new OPENDOTAHelper();
  return openDotaHelper.getTeams().then(function(teams){
    var teamAId = openDotaHelper.getTeamByTeamName(teams,teamA);
    return steamHelper.getTeamInfoByTeamID(teamAId.team_id).then(function(team){
      if(team){
        const country_code = team.country_code;
      }
      res.say('Team '+teamA+' is base in '+ country_code);
    });
  });
}];
module.exports = teamInfoIntent;
