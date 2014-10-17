#!/usr/bin/env node

var express = require('express');
var app = express();
app.listen(process.argv[2]);
console.log('App listening on ', process.argv[2]);