'use strict';
//past match/serie
// "Did [team] win?"
// "Who won the [team or event] game?"
// "What is the score of the [team name] game?"
var OPENDOTAHelper = require('../lib/opendota_helper');
let pastSerieIntent = [{
  'slots': {
    'TEAMA': 'TEAM',
    'NUMGAMES': 'NUMBER',
  },
  'utterances': [

    'Did {-|TEAMA} win',
    '{|how} {|is|are} {|the} {-|TEAMA} {|doing}',
    'Who won {|the} {-|TEAMA} game',
    "What {|is} the score of {|the} {-|TEAMA} game",
    "{|team} {-|TEAMA} {|past} {-|NUMGAMES} {|recent} {|games} {|series} results",
    "{|team} {-|TEAMA} last game"
  ]

},function(req, res){
  var teamA = req.slot('TEAMA');

  var num = typeof req.slot('NUMGAMES') === 'undefined' ?1: req.slot('NUMGAMES');
  console.log(num,'games');
  var openDotaHelper = new OPENDOTAHelper();
  return openDotaHelper.getTeams().then(function(teams){
    //console.log(teams);
    console.log('PPP');
    var teamAId = openDotaHelper.getTeamByTeamName(teams,teamA);
console.log(teamAId);
    return openDotaHelper.getTeamSeries(teamAId.team_id,num).then(function(series){
      let verb = "win";
      console.log(series);
      if(series.length === 0){
        res.say(`There are no recent matches for Team ${teamA} `);

      }
      else if(series.length === 1){
        let serie = series[0];
        if(serie.win < serie.lost){
          verb ='lost';
        }else if(serie.win == serie.lost){
          verb ='draw';
        }
        let against = typeof serie.opponentName !== 'undefined'? `against ${serie.opponentName}` : '';
        res.say(`${teamA} ${verb} ${serie.win}-${serie.lost} ${against} at ${serie.leaguename}`);

      }else{
        let serieWin=0;
        let serieLost =0;
        let serieDraw =0;
        series.forEach(function(serie){
          if(serie.win < serie.lost){
            serieLost++;
          }else if(serie.win == serie.lost){
            serieDraw++;
          }else{
            serieWin++;
          }
        });
        let sentence =`${teamA}`;
        if(serieWin>0){
          sentence = sentence+ ` win ${serieWin} series`;
        }
        if(serieLost>0){
          sentence = sentence+ ` lost ${serieLost} series`;
        }
        if(serieDraw>0){
          sentence = sentence+ ` draw ${serieDraw} series`;
        }
        res.say(`${sentence}`);

      }

    });
  });
}];
module.exports = pastSerieIntent;
