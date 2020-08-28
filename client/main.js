import { Template } from 'meteor/templating';
import { CurPFDebaters } from '../imports/api/curpfdebaters.js';
import { CurIndividual } from '../imports/api/curindividual.js';
import { PastIndividual } from '../imports/api/pastindividual.js';
import { PastPFDebaters } from '../imports/api/pastpfdebaters.js';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import './index.html';



//console.log(CurIndividual.find({}).count());
// Meteor.call('getIndvDebaters', "Eric Fava-Pastilha", 
// (err, res) =>
// {
//   console.log(res);
// });
