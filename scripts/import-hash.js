#!/usr/bin/env node

var botName       = process.argv[2],
    automaticHash = process.argv[3],
    cwd           = process.cwd(),
    fs            = require('fs');

if (!botName || !automaticHash)
  return console.error('Usage: node import-hash.js <username> <hash>');

console.log('Importing hash for %s and saving to %s', botName, cwd + '/.' + botName);

fs.writeFile(cwd + '/.' + botName, new Buffer(automaticHash, 'base64'), function (err) {

  if (err)
    return console.error('Failed to import hash:', err.message);

  console.log('Hash has been imported!');

});
