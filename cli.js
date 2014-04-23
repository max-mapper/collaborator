#!/usr/bin/env node
var child = require('child_process')
var url = require('url')
var ghauth = require('ghauth')

var collaborator = require('./')

var authOptions = {
   // ~/.config/awesome.json will store the token
  configName : 'collaborator',
  // (optional) whatever GitHub auth scopes you require
  scopes     : [ 'repo' ],
  // (optional) saved with the token on GitHub
  note       : 'This token is for the collaborator module from NPM'
}

auth()

function auth() {
  var user = process.argv[2]
  if (!user) return console.error('Usage: collaborator <username-to-add>')
  ghauth(authOptions, function (err, authData) {
    if (err) return console.error(err)
    child.exec('git config --get remote.origin.url', function(err, stdo, stde) {
      if (err || stdo.toString() === '') return console.error('Error: Could not read git remote origin from current directory')
      var parts = stdo.toString().split('/')
      var repo = parts[parts.length - 1].split('.git')[0]
      collaborator(authData.token, user, repo, function(err, collaborators) {
        if (err) return console.error('Error: ' + err.message)
        console.log(collaborators)
      })
    })
  })
}
