'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('dotastat');
var OPENDOTAHelper = require('./lib/opendota_helper');
var SlotHelper = require('./lib/slot_handler');

app.launch(function(req, res) {
  var prompt = 'For delay information, tell me an Airport code.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});
//RESULTTYPE
//|recent performance|Past encounter|Win Rate
// "What is the score of the [team name] game?"
//
// "Who is winning the [event] game?"
//
// "When do the [team] play next?"
//
// "Did [team] win?"
//
// "Who won the [team or event] game?"
//
// "What was the score of the [team or event] game?"
//
// "When is the next [team] game?"
//
// "How are the [team] doing?"
// "is [team] playing now|today|tomorow"
// question

app.intent('dotastat', {
  'slots': {
    'TEAMA': 'TEAM',
    'TEAMB': 'TEAM',
    'RESULTTYPE': 'RESULTTYPE',
    'QUESTION': 'QUESTION',
    'DATE':'AMAZON.DATE',
    'STATUS': 'STATUS'
  },
  'utterances': [
    // 2 teams
    '{-|QUESTION} {|is|are} {|the} {-|RESULTTYPE} between {-|TEAMA} and {-|TEAMB}',
    // 1 team open question
    '{-|QUESTION} {|is|are} {|the} {-|TEAMA} {|doing|STRING}',
    // yes no question
    '{|is} {-|TEAMA} {|playing|live|win|STATUS} {-|DATE}',
    // 1 team result type
    '{-|TEAMA}\'s {-|RESULTTYPE}',
    // default
    '{-|TEAMA}'
  ]
},
  function(req, res) {
    //get the slot
    var slots = {
      'teamA' : req.slot('TEAMA'),
      'teamB' : req.slot('TEAMB'),
      question : req.slot('QUESTION'),
      status : req.slot('STATUS'),
      resulttype : req.slot('RESULTTYPE'),
      date : req.slot('DATE')
    }
    var slotHelper = new SlotHelper();
    var teamA = req.slot('TEAMA');
    var teamB = req.slot('TEAMB');
    var utterancesType = slotHelper.getUtterancesType(slots);


    console.log('start');
    console.log('parameter',utterancesType,teamA,teamB,slots.status,slots.question,slots.date);
    if (utterancesType === -1) {

    }else{
      var openDotaHelper = new OPENDOTAHelper();
      return openDotaHelper.getTeams().then(function(teams){
        console.log('in then',teams.length)

        openDotaHelper.teams=teams;


        var teamAId = openDotaHelper.getTeamByTeamName(teamA);
        switch(utterancesType){
          case 3:

            return openDotaHelper.getTeamPastPerformance(teamAId.team_id).then(function(matches){
              var numberOfWin = matches.rows.reduce(function(total, currentValue, currentIndex, arr){
                  if(currentValue.win){
                    total++;
                  }
                  return total;
              },0);
              res.say('Team '+teamA+' win '+numberOfWin+' out of last '+matches.rowCount+ ' games');
            });
            break;

          case 0:
            var teamBId = openDotaHelper.getTeamByTeamName(teamB);
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
            break;
          default:
            //TODO
        }
      }).catch(function(e){
        console.log(e);
      });

    }
  }
);

//hack to support custom utterances in utterance expansion string
console.log(app.utterances().replace(/\{\-\|/g, '{'));
module.exports = app;
