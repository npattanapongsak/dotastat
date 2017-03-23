'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var ENDPOINT = 'https://api.opendota.com/api/';
var SQLENDPOINT = 'https://api.opendota.com/api/explorer?sql=';
var teams = require('../data/teams.js');
function OPENDATAHelper() {
}

// FAADataHelper.prototype.requestAirportStatus = function(airportCode) {
//   return this.getAirportStatus(airportCode).then(
//     function(response) {
//       console.log('success - received airport info for ' + airportCode);
//       return response.body;
//     }
//   );
// };

OPENDATAHelper.prototype.getTeams = function() {


  return new Promise(function(resolve,reject){
    console.log('afs',teams.length);
    resolve(teams);
  })
  // var options = {
  //   method: 'GET',
  //   uri: ENDPOINT + 'teams',
  //   json: true
  //
  // };
  //return rp(options);
};
OPENDATAHelper.prototype.getTeamByTeamName = function(teamName) {
  for(var i=0 ;i<this.teams.length;i++){

    if(this.teams[i].name.toLowerCase() === teamName.toLowerCase()){
      return this.teams[i];
    }
  }
};

/*
Result
{ command: 'SELECT',
  rowCount: 20,
  oid: null,
  rows:
   [ { match_id: 2125426666, win: false },
    ...
   ],
  fields:
   [ { name: 'match_id',
       tableID: 928656867,
       columnID: 1,
       dataTypeID: 20,
       dataTypeSize: 8,
       dataTypeModifier: -1,
       format: 'text' },
     { name: 'win',
       tableID: 0,
       columnID: 0,
       dataTypeID: 16,
       dataTypeSize: 1,
       dataTypeModifier: -1,
       format: 'text' } ],
  _parsers: [ null, null ],
  rowAsArray: false,
  err: null }
*/
OPENDATAHelper.prototype.getTeamPastPerformance = function(teamId) {
  var sql,options;
  sql = `SELECT
  DISTINCT matches.match_id,
  ((player_matches.player_slot < 128) = matches.radiant_win) win
  FROM matches
  JOIN match_patch
  USING (match_id)
  JOIN leagues
  USING(leagueid)
  JOIN player_matches
  USING(match_id)
  LEFT JOIN notable_players
  USING(account_id)
  LEFT JOIN teams
  USING(team_id)
  JOIN heroes
  ON player_matches.hero_id = heroes.id
  WHERE TRUE
  AND notable_players.team_id = ${teamId}
  ORDER BY matches.match_id DESC NULLS LAST
  LIMIT 10`;
  options = {
    method: 'GET',
    uri: SQLENDPOINT + encodeURIComponent(sql),
    json: true
  };

  return rp(options);
};

/*
RESULT
{"command":"SELECT","rowCount":33,"oid":null,"rows":[
{"match_id":2933092997,"radiant_team_id":2586976,"dire_team_id":39,"radiant_win":false,"duration":3055,"name":"Dota Pit League Season Five","start_time":1485135564,"datetime":"2017-01-23T01:39:24.000Z"},
],
"fields":[{"name":"match_id","tableID":928656867,"columnID":1,"dataTypeID":20,"dataTypeSize":8,"dataTypeModifier":-1,"format":"text"},{"name":"radiant_team_id","tableID":928656867,"columnID":20,"dataTypeID":23,"dataTypeSize":4,"dataTypeModifier":-1,"format":"text"},{"name":"dire_team_id","tableID":928656867,"columnID":21,"dataTypeID":23,"dataTypeSize":4,"dataTypeModifier":-1,"format":"text"},{"name":"radiant_win","tableID":928656867,"columnID":3,"dataTypeID":16,"dataTypeSize":1,"dataTypeModifier":-1,"format":"text"},{"name":"duration","tableID":928656867,"columnID":5,"dataTypeID":23,"dataTypeSize":4,"dataTypeModifier":-1,"format":"text"},{"name":"name","tableID":928656840,"columnID":5,"dataTypeID":1043,"dataTypeSize":-1,"dataTypeModifier":259,"format":"text"},{"name":"start_time","tableID":928656867,"columnID":4,"dataTypeID":23,"dataTypeSize":4,"dataTypeModifier":-1,"format":"text"},{"name":"datetime","tableID":0,"columnID":0,"dataTypeID":1114,"dataTypeSize":8,"dataTypeModifier":-1,"format":"text"}],"_parsers":[null,null,null,null,null,null,null,null],"rowAsArray":false,"err":null}
*/
OPENDATAHelper.prototype.getPassEncouter = function(teamAId,teamBId) {
  var sql,options;
  sql = `SELECT
  DISTINCT matches.match_id,radiant_team_id,dire_team_id,radiant_win
  FROM matches
  JOIN match_patch
  USING (match_id)
  JOIN player_matches
  USING(match_id)
  LEFT JOIN notable_players
  USING(account_id)
  LEFT JOIN teams
  USING(team_id)
  JOIN heroes
  ON player_matches.hero_id = heroes.id
  WHERE TRUE
  AND (radiant_team_id = ${teamAId} AND dire_team_id =${teamBId} or radiant_team_id = ${teamBId} AND dire_team_id =${teamAId})
  ORDER BY matches.match_id DESC NULLS LAST
  LIMIT 10`;
  options = {
    method: 'GET',
    uri: SQLENDPOINT + encodeURIComponent(sql),
    json: true
  };

  return rp(options);
};
/*
SELECT
DISTINCT matches.match_id,radiant_team_id,dire_team_id,radiant_win,matches.duration,leagues.name,matches.start_time,TIMESTAMP 'epoch' + matches.start_time * INTERVAL '1 second' as datetime
FROM matches
JOIN match_patch
USING (match_id)
JOIN leagues
USING(leagueid)
JOIN player_matches
USING(match_id)
LEFT JOIN notable_players
USING(account_id)
LEFT JOIN teams
USING(team_id)

JOIN heroes
ON player_matches.hero_id = heroes.id
WHERE TRUE
AND (radiant_team_id = 39 AND dire_team_id =2586976 or radiant_team_id = 2586976 AND dire_team_id =39)
ORDER BY matches.match_id DESC
limit 50
*/
/* GET past performance

SELECT
DISTINCT matches.match_id,
((player_matches.player_slot < 128) = matches.radiant_win) win
FROM matches
JOIN match_patch
USING (match_id)
JOIN leagues
USING(leagueid)
JOIN player_matches
USING(match_id)
LEFT JOIN notable_players
USING(account_id)
LEFT JOIN teams
USING(team_id)
JOIN heroes
ON player_matches.hero_id = heroes.id
WHERE TRUE
AND notable_players.team_id = 3326875

ORDER BY matches.match_id DESC NULLS LAST
LIMIT 150
*/
/*
SELECT
DISTINCT matches.match_id,radiant_team_id,dire_team_id,radiant_win
FROM matches
JOIN match_patch
USING (match_id)
JOIN player_matches
USING(match_id)
LEFT JOIN notable_players
USING(account_id)
LEFT JOIN teams
USING(team_id)
JOIN heroes
ON player_matches.hero_id = heroes.id
WHERE TRUE
AND (radiant_team_id = 3326875 AND dire_team_id =39 or radiant_team_id = 39 AND dire_team_id =3326875)
ORDER BY matches.match_id DESC NULLS LAST
LIMIT 10
*/

// FAADataHelper.prototype.formatAirportStatus = function(airportStatus) {
//   var weather = _.template('The current weather conditions are ${weather}, ${temp} and wind ${wind}.')({
//     weather: airportStatus.weather.weather,
//     temp: airportStatus.weather.temp,
//     wind: airportStatus.weather.wind
//   });
//   if (airportStatus.delay === 'true') {
//     var template = _.template('There is currently a delay for ${airport}. ' +
//       'The average delay time is ${delay_time}. ' +
//       'Delay is because of the following: ${delay_reason}. ${weather}');
//     return template({
//       airport: airportStatus.name,
//       delay_time: airportStatus.status.avgDelay,
//       delay_reason: airportStatus.status.reason,
//       weather: weather
//     });
//   } else {
//     //no delay
//     return _.template('There is currently no delay at ${airport}. ${weather}')({
//       airport: airportStatus.name,
//       weather: weather
//     });
//   }
// };

module.exports = OPENDATAHelper;
