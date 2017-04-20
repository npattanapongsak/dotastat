//live matches
/*
http://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v1/?key=
*/
'use strict';
var DOTAHelper = require('../lib/dota_helper');
var OPENDOTAHelper = require('../lib/opendota_helper');
var moment = require('moment');
require('moment-precise-range-plugin');
let upcommingMatchesIntent = [{
  'slots': {
    'TEAMA': 'TEAM'
  },
  'utterances': [
      '{|When} {|is} {|the} {|next|upcoming|} {|team} {-|TEAMA} {|game|matches}',
      "{|When} {|do} {|the} {|team} {-|TEAMA} play next",
      "{|is} {|team} {-|TEAMA} playing",
      "{-|TEAMA} {|next} match",
      "upcoming matches"
  ]
},function(req, res){
  var teamA = req.slot('TEAMA');
  console.log('Team '+teamA);
  var dotaHelper = new DOTAHelper();
  var openDotaHelper = new OPENDOTAHelper();
  return openDotaHelper.getTeams().then(function(teams){
    var teamObj = openDotaHelper.getTeamByTeamName(teams,teamA);

    return dotaHelper.getUpcommingMatches(teamObj.team_id).then(function(matches){
      if(matches.length === 0 ){
        res.say('There are no upcoming matches for Team '+teamA );
        return ;
      }
      //res.say('Team '+teamA+' has '+matches.length+ ' upcoming matches');
      var oppTeam = matches[0].team1;
      if(matches[0].team1.team_id === teamObj.team_id){
        oppTeam = matches[0].team2;
      }
      //console.log(moment.unix() , moment(matches[0].time*1000));
      console.log(moment.preciseDiff(moment(), moment(matches[0].time*1000),true));
      const duration = moment.preciseDiff(moment(), moment(matches[0].time*1000),true);
      var isDays=false,isHours = false,isMinutes =false;
      let day='',hour='',minute='',timeString='';
      if(duration.days !== 0){


        day = duration.days+ ' '+(duration.days ===1 ? 'day':'days');
        if(duration.hours !== 0){
          hour = duration.hours+ ' '+(duration.hours ===1 ? 'hour':'hours');
          timeString = day+' and '+hour;
        }else{
          timeString =  day;
        }


      }else if(duration.hours !== 0){
        hour = duration.hours+ ' '+(duration.hours ===1 ? 'hour':'hours');
        if(duration.minutes !== 0){
          minute = duration.minutes+ ' '+(duration.minutes ===1 ? 'minute':'minutes');
          timeString =  hour+' and '+minute;
        }else{
          timeString = hour;
        }
      }else if(duration.minutes !== 0){

        minute = duration.minutes+ ' '+(duration.minutes ===1 ? 'minute':'minutes');
        timeString =  minute;
      }else{
        timeString = 'a few seconds';
      }







/*
{ years: 0,
  months: 0,
  days: 1,
  hours: 7,
  minutes: 3,
  seconds: 52,
  firstDateWasLater: false }
*/
      if(+ new Date() - moment(matches[0].time*1000) > 0){
        res.say('Team '+teamA+' is playing now against '+ oppTeam.name + ' started '+moment(matches[0].time*1000).fromNow()+ ' in '+matches[0].league + ' Tournament ');
      }else{
        res.say('Team '+teamA+' will play against '+ oppTeam.name + ' in '+timeString + ' in '+matches[0].league + ' Tournament ');
      }




    });
  });
}];
module.exports = upcommingMatchesIntent;
