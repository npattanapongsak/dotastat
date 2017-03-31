'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('dotastat');
var OPENDOTAHelper = require('./lib/opendota_helper');
var SlotHelper = require('./lib/slot_handler');
var pastSerieIntent = require('./intent/pastSerieIntent');
var pastEncounterIntent = require('./intent/pastEncounterIntent');
var teamInfoIntent = require('./intent/teamInfoIntent');
var upcomingMatchIntent = require('./intent/upcomingMatchIntent');
app.launch(function(req, res) {
  var prompt = 'Ask anything about professional dota team.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});
//RESULTTYPE
//|recent performance|Past encounter|Win Rate

// "What is the score of the [team name] game?"
//
// "Who is winning the [event] game?"
//
// "When do the [team] play next?"
// "When is the next [team] game?"
//
// "How are the [team] doing?"
// "is [team] playing now|today|tomorow"



//past match/serie 1 team
// "Did [team] win?"
// "Who won the [team or event] game?"
// "What is the score of the [team name] game?"

/* team info
    past performance
    player - position - hero
    http://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v1?key=03953ECF4F671B4DBD31B98B45FA39FC&start_at_team_id=2512249
      -country
*/
app.intent('teamInfoIntent', ...teamInfoIntent);
app.intent('pastEncounterIntent', ...pastEncounterIntent);
app.intent('pastSerieIntent', ...pastSerieIntent);
app.intent('upcomingMatchIntent', ...upcomingMatchIntent);

app.intent('dotastat', {
  'slots': {
    'TEAMA': 'TEAM',
    'RESULTTYPE': 'RESULTTYPE',
    'QUESTION': 'QUESTION',
    'DATE':'AMAZON.DATE',
    'STATUS': 'STATUS'
  },
  'utterances': [
    // 1 team open question
    '{-|QUESTION} {|is|are} {|the} {-|TEAMA} {|doing}',
    // yes no question
    '{|is} {-|TEAMA} {-|STATUS} {-|DATE}',
    // 1 team result type
    '{-|TEAMA} {-|RESULTTYPE}'
    // default
    //'{-|TEAMA}'
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
        console.log('in then',teams.length);

        openDotaHelper.teams=teams;


        var teamAId = openDotaHelper.getTeamByTeamName(teams,teamA);
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
          default:
            //res.say('i dont understand');
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
