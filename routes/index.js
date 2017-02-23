// routes/index.js

const vmaxRoutes = require('./vmax_routes');

module.exports = function(app) {
  vmaxRoutes(app);
};
