// app.js

var express = require('express')
var app = express()

var port = process.env.PORT || 3000;

String.prototype.chunk = function (n) {
  var ret = [];
  for (var i = 0, len = this.length; i < len; i += n) {
    ret.push(this.substr(i, n));
  }
  return ret;
};

require('./routes')(app);
app.listen(port, function () {
  console.log('WWN Generator is now listening on port ' + port)
})
