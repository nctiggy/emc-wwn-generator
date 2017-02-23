// routes/vmax_routes.js
var vmaxModel = require('../models/vmax_model.js');

module.exports = function(app) {

  app.get('/symmetrix/:sn', (req, res) => {
    // call to get WWN's

    var sn = req.params.sn;
    if (sn.length > 9) {
      sn = parseInt(sn, 10);
      sn = sn.toString();
    };

    if (sn.length < 9) {
      res.json({"error": "serial number invalid"});
    };

    if(vmaxModel.validateSerialNumber(sn)){
      var portList = vmaxModel.createPortsList(sn);
      var displayList = vmaxModel.getDisplayWWNs(sn, portList);
    };

    res.json(displayList);
  });

};
