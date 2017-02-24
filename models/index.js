// models/index.js

var vmaxModel = require('./vmax_model.js');
var xtremioModel = require('./xtremio_model.js');

module.exports = function() {
  vmaxModel();
  xtremioModel();
};
