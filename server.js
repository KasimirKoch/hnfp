#!/usr/bin/env node

var request = require('request');
var moment = require('moment');

var testId = process.argv[2] || 8466437;
var lastMomentOnFP = null;

console.log('Searching for id: ', process.argv[2] || testId);

setInterval(function(){
  request('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty', function(err, res, body){
    if(err) { throw err;}
    else {
      var posInTop = JSON.parse(body).indexOf(testId);
      responder(posInTop > -1 && posInTop < 30);
    }
  });
}, 1000);

function responder(bool){
  var currentTime = new Date();
  if(bool){
    lastMomentOnFP = lastMomentOnFP || new Date();
    var diff = currentTime - lastMomentOnFP;
    var d = moment.duration(diff, 'milliseconds');
    var hours = Math.floor(d.asHours());
    var mins = Math.floor(d.asMinutes()) - hours * 60;
    var seconds = Math.floor(d.asSeconds()) - hours * 3600 - mins * 60;
    console.log('------------------------------------------------------------');
    console.log(currentTime);
    console.log("On the front page for " + hours + " hours, " + mins + " minutes, and " + seconds + " seconds.");
    console.log('------------------------------------------------------------');
  } else {
    console.log('------------------------------------------------------------');
    console.log(currentTime);
    console.log('Not on the front page yet! Good luck :)');
    console.log('------------------------------------------------------------');
  } 
}

