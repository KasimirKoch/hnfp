#!/usr/bin/env node
if(!process.argv[2]){
  throw 'Please enter a Hacker News ID';
}
if(!process.argv[3]){
  throw 'Please enter a polling frequency';
}
// Dependencies
var request = require('request');
var moment = require('moment');

// User input from console
var articleID = parseInt(process.argv[2]);
var pollingFrequency = parseInt(process.argv[3]) * 60000;

// Article Specific Data
var lastMomentOnFP = null,
    title = null,
    author = null,
    streak = 0,
    streakHours,
    streakMins,
    streakSeconds;

console.log('Tracking ID: ', articleID);
getArticleInfo(articleID);
setInterval(checkFrontPage, pollingFrequency);

// Get initial data on the article
function getArticleInfo(id){
  request('https://hacker-news.firebaseio.com/v0/item/' + id + '.json?print=pretty', 
    function(err, res, body){
      if(err){
        throw err;
      } else {
        body = JSON.parse(body);
        author = body.by;
        title = body.title;
        checkFrontPage();
      }
    }
  );
}


// Determine if article is on the front page of Hacker News
function checkFrontPage(){
  request('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty', 
    function(err, res, body){
      if(err) {
        throw err;
      } else {
        var posInTop = JSON.parse(body).indexOf(articleID);
        responder(posInTop > -1 && posInTop < 30);
      }
    }
  );
}

// Respond based on whether article is on front page or not
function responder(bool){
  var currentTime = new Date();
  if(bool){
    lastMomentOnFP = lastMomentOnFP || new Date();
    var diff = currentTime - lastMomentOnFP;
    var d = moment.duration(diff, 'milliseconds');
    if(d > streak){
      streak = d;
      streakHours = Math.floor(streak.asHours());
      streakMins = Math.floor(streak.asMinutes()) - hours * 60;
      streakSeconds = Math.floor(streak.asSeconds()) - hours * 3600 - mins * 60;
    }
    var hours = Math.floor(d.asHours());
    var mins = Math.floor(d.asMinutes()) - hours * 60;
    var seconds = Math.floor(d.asSeconds()) - hours * 3600 - mins * 60;
    console.log('------------------------------------------------------------');
    console.log(currentTime);
    console.log('\"' + title + '\", by: ' + author);
    console.log('On the front page for ' + hours + ' hours, ' + 
      mins + ' minutes, and ' + seconds + ' seconds.');
    if(streak !== d && streak !== 0){
      console.log('Longest Streak:' + streakHours + ' hours, ' + 
        streakMins + ' minutes, and ' + streakSeconds + ' seconds.');
    }
    console.log('------------------------------------------------------------');
  } else {
    lastMomentOnFP = null;
    console.log('------------------------------------------------------------');
    console.log(currentTime);
    console.log('\"' + title + '\", by: ' + author);
    console.log('Not on the front page yet! Good luck :)');
    if(streak !== 0){
      console.log('Longest Streak:' + streakHours + ' hours, ' + 
        streakMins + ' minutes, and ' + streakSeconds + ' seconds.');
    }
    console.log('------------------------------------------------------------');
  } 
}