#!/usr/bin/env node
var child = require('child_process')
var url = require('url')
var ghauth = require('ghauth')
var argv = require('minimist')(process.argv.splice(2), {boolean: true})
var collaborator = require('./')
var findNPM = require('find-npm-by-github')

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
  var user = argv._[0]
  ghauth(authOptions, function (err, authData) {
    if (err) return console.error(err)
    child.exec('git config --get remote.origin.url', function(err, stdo, stde) {
      if (err || stdo.toString() === '') return console.error('Error: Could not read git remote origin from current directory')
      var parts = stdo.toString().split('/')
      var repo = parts[parts.length - 1].split('.git')[0].trim()
      collaborator(authData.token, user, repo, function(err, collaborators) {
        if (err) return console.error('Error: ' + err.message)
        var collabs = collaborators.map(function(c) { return {'username': c.login, 'avatar': c.avatar_url }})

        var out = '## Collaborators\n\n'
          + repo + ' is only possible due to the excellent work of the following collaborators:\n\n'
          + makeTable(collabs)
          
        console.log(out)
      })
    })
    if(argv.npm) {
      findNPM(authData.token, user, function (err, npmName) {
        if (err) return console.error('Could not determine npm name (' +err.message+')')
        if (!npmName) return console.error('Could not determine npm name')
        child.exec('npm owner add ' + npmName + ' --quiet', function (err, stdo, stde) {
          if(err || stde.toString() != '') return console.log('Error: Could not add ' + npmName + ' on npm')
          child.exec('npm ls', function (err, stdo, stde) {
            var moduleName = stdo.toString().split('@')[0]
            console.error('Added ' + npmName + ' to module ' + moduleName)
          })
        })
      })
    }
  })
}

function makeTable(rows) {
  var table = '<table><tbody>'
  rows.map(function(row) {
    table += '<tr><th align="left">' + row.username + '</th><td><a href="https://github.com/' + row.username + '">GitHub/' + row.username + '</a></td></tr>\n'
  })
  table += '</tbody></table>'
  return table
}
