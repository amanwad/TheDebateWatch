import { Meteor } from 'meteor/meteor';
import { CurPFDebaters } from '../imports/api/curpfdebaters.js';
import { CurIndividual } from '../imports/api/curindividual.js';


Meteor.startup(() => {
  // code to run on server at startup
    // for(var team in pf1920){
    //   for(var tourney in pf1920[team]){
    //     CurIndividual.insert({
    //       individual:team,
    //       tournament:tourney,
    //       partner: pf1920[team][tourney]["partner"],
    //       url:pf1920[team][tourney]["url"],
    //       elimround:pf1920[team][tourney]["elimround"],
    //       prelimW:pf1920[team][tourney]["prelimW"],
    //       prelimL:pf1920[team][tourney]["prelimL"],
    //       outroundW:pf1920[team][tourney]["outW"],
    //       outroundL:pf1920[team][tourney]["outL"],
    //       bid:pf1920[team][tourney]["bid"]});
    //   }
    // }


});
Meteor.methods({
  printstuff(){
    // for(var team in pf1920){
    //   for(var tourney in pf1920[team]){
    //     CurPFDebaters.insert({
    //       team:team,
    //       tournament:tourney,
    //       url:pf1920[team][tourney]["url"],
    //       elimround:pf1920[team][tourney]["elimround"],
    //       prelimW:pf1920[team][tourney]["prelimW"],
    //       prelimL:pf1920[team][tourney]["prelimL"],
    //       outroundW:pf1920[team][tourney]["outW"],
    //       outroundL:pf1920[team][tourney]["outL"],
    //       bid:pf1920[team][tourney]["bid"]});
    //   }
    // }
  },
  deleteStuff(){
    CurPFDebaters.remove({});
  },
  getCurDebaters(name1,name2){
    var firstName = name1.toUpperCase();
    var secName = name2.toUpperCase();
    var temp = '';
    if(secName < firstName){
      temp = secName;
      secName = firstName;
      firstName = temp;
    }
    var names = firstName + "," + secName;
 
    var arr = CurPFDebaters.find({team:names});
    var index = 1;
    var totalprelimW = 0;
    var totalprelimL = 0;
    var totaloutW = 0;
    var totaloutL = 0;
    var breaks = 0;
    var gold = 0;
    var ghost = 0;
    var silver = 0;
    var x = [];
    var y = [];
    arr.forEach((team) => {
      y = [];
      y.push(team.tournament);
      y.push(team.url);
      y.push(team.prelimW);
      totalprelimW+=parseInt(team.prelimW);
      y.push(team.prelimL);
      totalprelimL+=parseInt(team.prelimL);
      y.push(team.outroundW);
      totaloutW+=parseInt(team.outroundW);
      y.push(team.outroundL);
      totaloutL+=parseInt(team.outroundL);
      y.push(team.bid);      

      if(team.elimround.includes('4')||team.elimround.includes('5')||team.elimround.includes('6')||team.elimround.includes('7')){
        y.push("No Break");
      }
      else{
        breaks+=1;
        y.push(team.elimround);
      }
      if(team.bid.includes("Gold")){
        gold+=1;
      }
      else if(team.bid.includes("Ghost")){
        ghost+=1;
      }
      else if(team.bid.includes("Silver")){
        silver+=1;
      }
    
      x.push(y);
    });

    var totalCounts = [];
    totalCounts.push(totalprelimW);
    totalCounts.push(totalprelimL);
    totalCounts.push(totaloutW);
    totalCounts.push(totaloutL);
    totalCounts.push(breaks);
    totalCounts.push(gold);
    totalCounts.push(ghost);
    totalCounts.push(silver);

    x.unshift(totalCounts);
    return(x);
    
    
  },
  getIndvDebaters(name){
      var firstName = name.substring(0,name.indexOf(' ')).toUpperCase().trim();
      var secName = name.substring(name.indexOf(' ')).toUpperCase().trim();
      var names = firstName + " " + secName;
   
      var arr = CurIndividual.find({individual:names});
      var index = 1;
      var totalprelimW = 0;
      var totalprelimL = 0;
      var totaloutW = 0;
      var totaloutL = 0;
      var breaks = 0;
      var gold = 0;
      var ghost = 0;
      var silver = 0;
      var x = [];
      var y = [];
      arr.forEach((team) => {
        y = [];
        y.push(team.tournament);
        y.push(team.partner);
        y.push(team.url);
        y.push(team.prelimW);
        totalprelimW+=parseInt(team.prelimW);
        y.push(team.prelimL);
        totalprelimL+=parseInt(team.prelimL);
        y.push(team.outroundW);
        totaloutW+=parseInt(team.outroundW);
        y.push(team.outroundL);
        totaloutL+=parseInt(team.outroundL);
        y.push(team.bid);      
  
        if(team.elimround.includes('4')||team.elimround.includes('5')||team.elimround.includes('6')||team.elimround.includes('7')){
          y.push("No Break");
        }
        else{
          breaks+=1;
          y.push(team.elimround);
        }
        if(team.bid.includes("Gold")){
          gold+=1;
        }
        else if(team.bid.includes("Ghost")){
          ghost+=1;
        }
        else if(team.bid.includes("Silver")){
          silver+=1;
        }
      
        x.push(y);
      });
  
      var totalCounts = [];
      totalCounts.push(totalprelimW);
      totalCounts.push(totalprelimL);
      totalCounts.push(totaloutW);
      totalCounts.push(totaloutL);
      totalCounts.push(breaks);
      totalCounts.push(gold);
      totalCounts.push(ghost);
      totalCounts.push(silver);
  
      x.unshift(totalCounts);
      return(x);
      
      
    
  }
});