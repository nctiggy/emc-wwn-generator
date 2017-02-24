// routes/vmax_routes.js
var xtremioModel = require('../models/xtremio_model.js');

module.exports = function(app) {

  app.get('/xtremio/:sn/:num_of_bricks', (req, res) => {
    // call to get WWN's

    var psnt = req.params.sn;
    var brickNum = req.params.num_of_bricks

    if (xtremioModel.testBrickNumber(brickNum) && xtremioModel.test(psnt)) {
      var data = xtremioModel.calculateWnnAndWwpn(psnt, brickNum);
      var json_response = { "wwnn": data.wwnn, "wwns": data.wwns};
      res.json(json_response);
    }

  });

};
