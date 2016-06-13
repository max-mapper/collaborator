var request = require('request')
var base = 'https://api.github.com'

module.exports = function(token, action, user, repo, cb) {
  var headers = {"user-agent": "collaborator module"}
  headers['Authorization'] = 'token ' + token
  request(base + '/user', {json: true, headers: headers}, function(err, resp, me) {
    if (err) return cb(err)
    if (user) {
      if (action === 'add') addCollaborators()
      else if (action === 'del') delCollaborators()
    }
    else getCollaborators()
    
    function addCollaborators() {
      var reqUrl = base + '/repos/' + me.login + '/' + repo + '/collaborators/' + user
      request.put(reqUrl, { json: true, headers: headers }, function(err, resp, body) {
        if (err || resp.statusCode > 299) return cb(err || resp.statusCode)
        getCollaborators()
      })
    }
  
    function delCollaborators() {
      var reqUrl = base + '/repos/' + me.login + '/' + repo + '/collaborators/' + user
      request.delete(reqUrl, { json: true, headers: headers }, function(err, resp, body) {
        if (err || resp.statusCode > 299) return cb(err || resp.statusCode)
        getCollaborators()
      })
    }
  
    function getCollaborators() {
      var reqUrl = base + '/repos/' + me.login + '/' + repo + '/collaborators'
      request(reqUrl, { json: true, headers: headers }, function(err, resp, collabs) {
        if (err || resp.statusCode > 299) return cb(err || resp.statusCode)
        cb(null, collabs)
      })
    }
  })
}

