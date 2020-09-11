import { Meteor } from 'meteor/meteor';
import { CurPFDebaters } from '../imports/api/curpfdebaters.js';
import { CurPFDebatersNames } from '../imports/api/curpfdebatersnames.js';
import { CurIndividual } from '../imports/api/curindividual.js';
import { CurIndividualNames } from '../imports/api/curindividualnames.js';
import { PastPFDebaters } from '../imports/api/pastpfdebaters.js';
import { PastPFDebatersNames } from '../imports/api/pastpfdebatersnames.js';
import { PastIndividual } from '../imports/api/pastindividual.js';
import { PastIndividualNames } from '../imports/api/pastindividualnames.js';
import { CurLD } from '../imports/api/curld.js';
import { CurLDNames } from '../imports/api/curldnames.js';

var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://admin:amanwadhwa@debatewatch-shard-00-00.0qc1l.mongodb.net:27017,debatewatch-shard-00-01.0qc1l.mongodb.net:27017,debatewatch-shard-00-02.0qc1l.mongodb.net:27017/debatedata?ssl=true&replicaSet=atlas-112ae9-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, function(err, client) {
  if(err){
    //console.log("ERR ERR ERR ERR ERR");
  }
  else{
    //console.log("CLIENT LOADED");
  }
  const collection = client.db("meteor").collection("CurLD");
  // perform actions on the collection object
  client.close();
});


Meteor.startup(() => {
    // for(var team in pf1920){
  //   for(var tourney in pf1920[team]){
  //     CurLD.insert({
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

  // var elems = CurLD.find({});
  //   elems.forEach((elem) => {
  //     var fullName = elem.team;
  //     //var lastName = fullName.substring(fullName.indexOf(' ')+1);
  //     if(CurLDNames.find({name:fullName}).count()==0){
  //       CurLDNames.insert({name:fullName});
  //     }
  //   })


});
Meteor.methods({
  printstuff(){
    for(var team in pf1920){
      for(var tourney in pf1920[team]){
        CurPFDebaters.insert({
          team:team,
          tournament:tourney,
          url:pf1920[team][tourney]["url"],
          elimround:pf1920[team][tourney]["elimround"],
          prelimW:pf1920[team][tourney]["prelimW"],
          prelimL:pf1920[team][tourney]["prelimL"],
          outroundW:pf1920[team][tourney]["outW"],
          outroundL:pf1920[team][tourney]["outL"],
          bid:pf1920[team][tourney]["bid"]});
      }
    }
  },
  deleteStuff(){
    PastPFDebatersNames.remove({});
    CurPFDebatersNames.remove({});
  },
  getCurDebaters2(name1, name2){
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
    var printNames = firstName.substring(0,1)+firstName.substring(1).toLowerCase() + ' & ' + secName.substring(0,1)+secName.substring(1).toLowerCase();
      var index = 0;
      var totalprelimW = 0;
      var totalprelimL = 0;
      var totaloutW = 0;
      var totaloutL = 0;
      var breaks = 0;
      var gold = 0;
      var ghost = 0;
      var silver = 0;
      var breakYN;
      var bidYN;
      var toc;
      var champ;
      var x = [];
      var y = [];
      arr.forEach((team) => {
        index +=1;
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
        champ=false;  
  
        if(team.elimround.includes('4')||team.elimround.includes('5')||team.elimround.includes('6')||team.elimround.includes('7')){
          y.push("No Break");
          breakYN = false;
        }
        else{
          breaks+=1;
          breakYN = true;
          if(String(team.elimround).substring(0,1)==="F" && Number(team.outroundL)==0){
            y.push("Champion");
            champ = true;
          }
          else{
          y.push(team.elimround);
          }
        }
        bidYN = false;
        if(team.bid.includes("Gold")){
          gold+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Ghost")){
          ghost+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Silver")){
          silver+=1;
          bidYN =true;
        }
        y.push(breakYN);
        y.push(bidYN);
        toc = false;
        if(team.tournament.includes("Champions")){
          toc = true;
        }
        y.push(toc);
        y.push(champ);
        x.push(y);
      });

      var totalCounts = [];
    totalCounts.push(printNames);

    var totalW = (totalprelimW + totaloutW);
    totalCounts.push(totalW);
    var totalL = (totaloutL + totalprelimL);
    totalCounts.push(totalL);
    var totalP = (totalW / (totalW + totalL)) * 100;
    totalCounts.push(Number(totalP.toFixed(2)));
    totalCounts.push(totalprelimW);
    totalCounts.push(totalprelimL);
    var prelimP = (totalprelimW / (totalprelimW + totalprelimL)) * 100;
    totalCounts.push(Number(prelimP.toFixed(2)));
    totalCounts.push(totaloutW);
    totalCounts.push(totaloutL);
    if(totaloutW==0){
      totalCounts.push(0);
    }
    else{
      var outP = (totaloutW / (totaloutW + totaloutL)) * 100;
      totalCounts.push(Number(outP.toFixed(2)));
    }
    totalCounts.push(breaks);
    var breakP = (breaks / index) * 100;
    totalCounts.push((index-breaks));
    totalCounts.push(Number(breakP.toFixed(2)));
    totalCounts.push(gold);
    totalCounts.push(ghost);
    totalCounts.push(silver);
  
    x.unshift(totalCounts);
    console.log(x);
    return(x);
      
  }
  ,
  getCurIndvDebaters(name){
    var firstName = name.substring(0,name.indexOf(' ')).toUpperCase().trim();
      var secName = name.substring(name.indexOf(' ')).toUpperCase().trim();
      var names = firstName + " " + secName;
   
      var arr = CurIndividual.find({individual:names});
      var index = 0;
      var totalprelimW = 0;
      var totalprelimL = 0;
      var totaloutW = 0;
      var totaloutL = 0;
      var breaks = 0;
      var gold = 0;
      var ghost = 0;
      var silver = 0;
      var breakYN;
      var bidYN;
      var toc;  
      var champ;
      var x = [];
      var y = [];
      arr.forEach((team) => {
        index +=1;
        y = [];
        y.push(team.tournament);
        var name = team.partner;
      var str = name;
      var final = "";
      while(str.includes(" ")){
          final += str.substring(0,1);
          var p = str.indexOf(" ");
          final = final + str.substring(1, p).toLowerCase() + ' ';
          str = str.substring(p+1);
      }
      final += str.substring(0,1);
      final = final + str.substring(1).toLowerCase();
      y.push(final);
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
        champ=false;  
  
        if(team.elimround.includes('4')||team.elimround.includes('5')||team.elimround.includes('6')||team.elimround.includes('7')){
          y.push("No Break");
          breakYN = false;
        }
        else{
          breaks+=1;
          breakYN = true;
          if(String(team.elimround).substring(0,1)==="F" && Number(team.outroundL)==0){
            y.push("Champion");
            champ = true;
          }
          else{
          y.push(team.elimround);
          }
        }
        bidYN = false;
        if(team.bid.includes("Gold")){
          gold+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Ghost")){
          ghost+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Silver")){
          silver+=1;
          bidYN =true;
        }
        y.push(breakYN);
        y.push(bidYN);
        toc = false;
        if(team.tournament.includes("Champions")){
          toc = true;
        }
        y.push(toc);
        y.push(champ);
        x.push(y);
      });
  
      var totalCounts = [];
      var str = names;
      var final = "";
      while(str.includes(" ")){
          final += str.substring(0,1);
          var p = str.indexOf(" ");
          final = final + str.substring(1, p).toLowerCase() + ' ';
          str = str.substring(p+1);
      }
      final += str.substring(0,1);
      final = final + str.substring(1).toLowerCase();

    totalCounts.push(final);

    var totalW = (totalprelimW + totaloutW);
    totalCounts.push(totalW);
    var totalL = (totaloutL + totalprelimL);
    totalCounts.push(totalL);
    var totalP = (totalW / (totalW + totalL)) * 100;
    totalCounts.push(Number(totalP.toFixed(2)));
    totalCounts.push(totalprelimW);
    totalCounts.push(totalprelimL);
    var prelimP = (totalprelimW / (totalprelimW + totalprelimL)) * 100;
    totalCounts.push(Number(prelimP.toFixed(2)));
    totalCounts.push(totaloutW);
    totalCounts.push(totaloutL);
    if(totaloutW==0){
      totalCounts.push(0);
    }
    else{
      var outP = (totaloutW / (totaloutW + totaloutL)) * 100;
      totalCounts.push(Number(outP.toFixed(2)));
    }
    totalCounts.push(breaks);
    var breakP = (breaks / index) * 100;
    totalCounts.push((index-breaks));
    totalCounts.push(Number(breakP.toFixed(2)));
    totalCounts.push(gold);
    totalCounts.push(ghost);
    totalCounts.push(silver);
  
    x.unshift(totalCounts);
    console.log(x);
    return(x);
    
  },
  getPastIndvDebaters(name) {
    var firstName = name.substring(0,name.indexOf(' ')).toUpperCase().trim();
      var secName = name.substring(name.indexOf(' ')).toUpperCase().trim();
      var names = firstName + " " + secName;
   
      var arr = PastIndividual.find({individual:names});
      var index = 0;
      var totalprelimW = 0;
      var totalprelimL = 0;
      var totaloutW = 0;
      var totaloutL = 0;
      var breaks = 0;
      var gold = 0;
      var ghost = 0;
      var silver = 0;
      var breakYN;
      var bidYN;
      var toc;  
      var champ;
      var x = [];
      var y = [];
      arr.forEach((team) => {
        index +=1;
        y = [];
        y.push(team.tournament);
        var name = team.partner;
      var str = name;
      var final = "";
      while(str.includes(" ")){
          final += str.substring(0,1);
          var p = str.indexOf(" ");
          final = final + str.substring(1, p).toLowerCase() + ' ';
          str = str.substring(p+1);
      }
      final += str.substring(0,1);
      final = final + str.substring(1).toLowerCase();
      y.push(final);
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
        champ=false;  
  
        if(team.elimround.includes('4')||team.elimround.includes('5')||team.elimround.includes('6')||team.elimround.includes('7')){
          y.push("No Break");
          breakYN = false;
        }
        else{
          breaks+=1;
          breakYN = true;
          if(String(team.elimround).substring(0,1)==="F" && Number(team.outroundL)==0){
            y.push("Champion");
            champ = true;
          }
          else{
          y.push(team.elimround);
          }
        }
        bidYN = false;
        if(team.bid.includes("Gold")){
          gold+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Ghost")){
          ghost+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Silver")){
          silver+=1;
          bidYN =true;
        }
        y.push(breakYN);
        y.push(bidYN);
        toc = false;
        if(team.tournament.includes("Champions")){
          toc = true;
        }
        y.push(toc);
        y.push(champ);
        x.push(y);
      });
  
      var totalCounts = [];
      var totalCounts = [];
      var str = names;
      var final = "";
      while(str.includes(" ")){
          final += str.substring(0,1);
          var p = str.indexOf(" ");
          final = final + str.substring(1, p).toLowerCase() + ' ';
          str = str.substring(p+1);
      }
      final += str.substring(0,1);
      final = final + str.substring(1).toLowerCase();

    totalCounts.push(final);

    var totalW = (totalprelimW + totaloutW);
    totalCounts.push(totalW);
    var totalL = (totaloutL + totalprelimL);
    totalCounts.push(totalL);
    var totalP = (totalW / (totalW + totalL)) * 100;
    totalCounts.push(Number(totalP.toFixed(2)));
    totalCounts.push(totalprelimW);
    totalCounts.push(totalprelimL);
    var prelimP = (totalprelimW / (totalprelimW + totalprelimL)) * 100;
    totalCounts.push(Number(prelimP.toFixed(2)));
    totalCounts.push(totaloutW);
    totalCounts.push(totaloutL);
    if(totaloutW==0){
      totalCounts.push(0);
    }
    else{
      var outP = (totaloutW / (totaloutW + totaloutL)) * 100;
      totalCounts.push(Number(outP.toFixed(2)));
    }
    totalCounts.push(breaks);
    var breakP = (breaks / index) * 100;
    totalCounts.push((index-breaks));
    totalCounts.push(Number(breakP.toFixed(2)));
    totalCounts.push(gold);
    totalCounts.push(ghost);
    totalCounts.push(silver);
  
    x.unshift(totalCounts);
    console.log(x);
    return(x);
        
  },
  getOverallPastIndvDebaters(name) {
    var firstName = name.substring(0,name.indexOf(' ')).toUpperCase().trim();
    var secName = name.substring(name.indexOf(' ')).toUpperCase().trim();
    var names = firstName + " " + secName;
 
    var arr = PastIndividual.find({individual:names});
    var index = 0;
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
      index = index+1;
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
    var name = names;
    var str = name;
    var final = "";
    while(str.includes(" ")){
        final += str.substring(0,1);
        var p = str.indexOf(" ");
        final = final + str.substring(1, p).toLowerCase() + ' ';
        str = str.substring(p+1);
    }
    final += str.substring(0,1);
    final = final + str.substring(1).toLowerCase();
    totalCounts.push(final);

    var totalW = (totalprelimW + totaloutW);
    totalCounts.push(totalW);
    var totalL = (totaloutL + totalprelimL);
    totalCounts.push(totalL);
    var totalP = (totalW / (totalW + totalL)) * 100;
    totalCounts.push(Number(totalP.toFixed(2)));
    totalCounts.push(totalprelimW);
    totalCounts.push(totalprelimL);
    var prelimP = (totalprelimW / (totalprelimW + totalprelimL)) * 100;
    totalCounts.push(Number(prelimP.toFixed(2)));
    totalCounts.push(totaloutW);
    totalCounts.push(totaloutL);
    if(totaloutW==0){
      totalCounts.push(0);
    }
    else{
      var outP = (totaloutW / (totaloutW + totaloutL)) * 100;
      totalCounts.push(Number(outP.toFixed(2)));
    }
    totalCounts.push(breaks);
    var breakP = (breaks / index) * 100;
    totalCounts.push((index-breaks));
    totalCounts.push(Number(breakP.toFixed(2)));
    totalCounts.push(gold);
    totalCounts.push(ghost);
    totalCounts.push(silver);
    
    return totalCounts;
  },
  getPastDebaters(name1,name2){
    var firstName = name1.toUpperCase();
    var secName = name2.toUpperCase();
    var temp = '';
    if(secName < firstName){
      temp = secName;
      secName = firstName;
      firstName = temp;
    }
    var names = firstName + "," + secName;
 
    var arr = PastPFDebaters.find({team:names});
    var printNames = firstName.substring(0,1)+firstName.substring(1).toLowerCase() + ' & ' + secName.substring(0,1)+secName.substring(1).toLowerCase();
      var index = 0;
      var totalprelimW = 0;
      var totalprelimL = 0;
      var totaloutW = 0;
      var totaloutL = 0;
      var breaks = 0;
      var gold = 0;
      var ghost = 0;
      var silver = 0;
      var breakYN;
      var bidYN;
      var toc;
      var champ;
      var x = [];
      var y = [];
      arr.forEach((team) => {
        index +=1;
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
        champ=false;  
  
        if(team.elimround.includes('4')||team.elimround.includes('5')||team.elimround.includes('6')||team.elimround.includes('7')){
          y.push("No Break");
          breakYN = false;
        }
        else{
          breaks+=1;
          breakYN = true;
          if(String(team.elimround).substring(0,1)==="F" && Number(team.outroundL)==0){
            y.push("Champion");
            champ = true;
          }
          else{
          y.push(team.elimround);
          }
        }
        bidYN = false;
        if(team.bid.includes("Gold")){
          gold+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Ghost")){
          ghost+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Silver")){
          silver+=1;
          bidYN =true;
        }
        y.push(breakYN);
        y.push(bidYN);
        toc = false;
        if(team.tournament.includes("Champions")){
          toc = true;
        }
        y.push(toc);
        y.push(champ);
        x.push(y);
      });

      var totalCounts = [];
    totalCounts.push(printNames);

    var totalW = (totalprelimW + totaloutW);
    totalCounts.push(totalW);
    var totalL = (totaloutL + totalprelimL);
    totalCounts.push(totalL);
    var totalP = (totalW / (totalW + totalL)) * 100;
    totalCounts.push(Number(totalP.toFixed(2)));
    totalCounts.push(totalprelimW);
    totalCounts.push(totalprelimL);
    var prelimP = (totalprelimW / (totalprelimW + totalprelimL)) * 100;
    totalCounts.push(Number(prelimP.toFixed(2)));
    totalCounts.push(totaloutW);
    totalCounts.push(totaloutL);
    if(totaloutW==0){
      totalCounts.push(0);
    }
    else{
      var outP = (totaloutW / (totaloutW + totaloutL)) * 100;
      totalCounts.push(Number(outP.toFixed(2)));
    }
    totalCounts.push(breaks);
    var breakP = (breaks / index) * 100;
    totalCounts.push((index-breaks));
    totalCounts.push(Number(breakP.toFixed(2)));
    totalCounts.push(gold);
    totalCounts.push(ghost);
    totalCounts.push(silver);
  
    x.unshift(totalCounts);
    console.log(x);
    return(x);
    
    
    
  },
  getCurLDdebaters(name){
      var firstName = name.substring(0,name.indexOf(' ')).toUpperCase().trim();
      var secName = name.substring(name.indexOf(' ')).toUpperCase().trim();
      var names = firstName + " " + secName;
   
      var arr = CurLD.find({team:names});
      var index = 0;
      var totalprelimW = 0;
      var totalprelimL = 0;
      var totaloutW = 0;
      var totaloutL = 0;
      var breaks = 0;
      var gold = 0;
      var ghost = 0;
      var breakYN;
      var bidYN;
      var toc;
      var champ;
      var x = [];
      var y = [];
      arr.forEach((team) => {
        index +=1;
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
        champ=false;  
  
        if(team.elimround.includes('4')||team.elimround.includes('5')||team.elimround.includes('6')||team.elimround.includes('7')){
          y.push("No Break");
          breakYN = false;
        }
        else{
          breaks+=1;
          breakYN = true;
          if(String(team.elimround).substring(0,1)==="F" && Number(team.outroundL)==0){
            y.push("Champion");
            champ = true;
          }
          else{
          y.push(team.elimround);
          }
        }
        bidYN = false;
        if(team.bid.includes("Gold")){
          gold+=1;
          bidYN = true;
        }
        else if(team.bid.includes("Ghost")){
          ghost+=1;
          bidYN = true;
        }
        y.push(breakYN);
        y.push(bidYN);
        toc = false;
        if(team.tournament.includes("Champions")){
          toc = true;
        }
        y.push(toc);
        y.push(champ);
        x.push(y);
      });

      var totalCounts = [];
      var str = names;
      var final = "";
      while(str.includes(" ")){
          final += str.substring(0,1);
          var p = str.indexOf(" ");
          final = final + str.substring(1, p).toLowerCase() + ' ';
          str = str.substring(p+1);
      }
      final += str.substring(0,1);
      final = final + str.substring(1).toLowerCase();
      
    totalCounts.push(final);

    var totalW = (totalprelimW + totaloutW);
    totalCounts.push(totalW);
    var totalL = (totaloutL + totalprelimL);
    totalCounts.push(totalL);
    var totalP = (totalW / (totalW + totalL)) * 100;
    totalCounts.push(Number(totalP.toFixed(2)));
    totalCounts.push(totalprelimW);
    totalCounts.push(totalprelimL);
    var prelimP = (totalprelimW / (totalprelimW + totalprelimL)) * 100;
    totalCounts.push(Number(prelimP.toFixed(2)));
    totalCounts.push(totaloutW);
    totalCounts.push(totaloutL);
    if(totaloutW==0){
      totalCounts.push(0);
    }
    else{
      var outP = (totaloutW / (totaloutW + totaloutL)) * 100;
      totalCounts.push(Number(outP.toFixed(2)));
    }
    totalCounts.push(breaks);
    var breakP = (breaks / index) * 100;
    totalCounts.push((index-breaks));
    totalCounts.push(Number(breakP.toFixed(2)));
    totalCounts.push(gold);
    totalCounts.push(ghost);
  
    x.unshift(totalCounts);
    console.log(x);
    return(x);
    
  },
  curIndividualArray(){
    var elems = CurIndividualNames.find();
    var arr = [];
    elems.forEach((elem) => {
      arr.push(elem.name);
    })
    return arr;
  },
  pastIndividualArray(){
    var elems = PastIndividualNames.find();
    var arr = [];
    elems.forEach((elem) => {
      arr.push(elem.name);
    })
    return arr;
  },
  curPFArray(){
    var elems = CurPFDebatersNames.find();
    var arr = [];
    elems.forEach((elem) => {
      arr.push(elem.name);
    })
    return arr;
  },
  pastPFArray(){
    var elems = PastPFDebatersNames.find();
    var arr = [];
    elems.forEach((elem) => {
      arr.push(elem.name);
    })
    return arr;
  },
  curLDArray(){
    var elems = CurLDNames.find();
    var arr = [];
    elems.forEach((elem) => {
      arr.push(elem.name);
    })
    return arr;
  },
  testingAtlas(){
    return CurIndividual.find().fetch();
  },
  testingServer(){
    return "server works";
  }
});