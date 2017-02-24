// routes/index.js

var vmaxRoutes = require('./vmax_routes');
var xtremioRoutes = require('./xtremio_routes');

module.exports = function(app) {
  vmaxRoutes(app);
  xtremioRoutes(app);
};
