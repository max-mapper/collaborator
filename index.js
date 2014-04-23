var request = require('request')
var base = 'https://api.github.com'

module.exports = function(token, user, repo, cb) {
  var headers = {"user-agent": "collaborator module"}
  headers['Authorization'] = 'token ' + token
  request(base + '/user', {json: true, headers: headers}, function(err, resp, me) {
    if (err) return cb(err)
    console.log(me)
  })
  // var reqUrl = base + '/repos/' + owner + '/' + repo + '/collaborators/' + user
  // request.put(reqUrl, function(err, resp, body) {
  //   console.log([err, resp.headers, resp.statusCode, body.toString()])
  // })
}