#!/usr/bin/env node

var sha           = require('crypto').createHash('sha1'),
    path          = require('path'),
    botName       = process.argv[2],
    ssfnLocation  = process.argv[3],
    cwd           = process.cwd(),
    fs            = require('fs');

if (!botName || !ssfnLocation)
  return console.error('Usage: node import-ssfn.js <username> <ssfn location>');

console.log('Importing hash for %s and saving to %s', botName, cwd + '/.' + botName);

fs.readFile(path.resolve(cwd, ssfnLocation), function (err, ssfnData) {

  if (err)
    return console.error('Failed to import ssfn:', err.message);

  sha.update(ssfnData);
  sha = new Buffer(sha.digest(), 'binary');

  fs.writeFile(cwd + '/.' + botName, sha, function (err) {

    if (err)
      return console.error('Failed to save hash:', err.message);

    console.log('Ssfn has been imported!');

  });

});
