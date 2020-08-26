import { Template } from 'meteor/templating';
import { CurPFDebaters } from '../imports/api/curpfdebaters.js';
import { CurIndividual } from '../imports/api/curindividual.js';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import './index.html';




Meteor.call('getIndvDebaters', "Eric Fava-Pastilha", 
(err, res) =>
{
  console.log(res);
});
