const SellingDetail = require("../models/selling.detail.model.js")


exports.get = (req, res) => {
    SellingDetail.get(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Sellings with ${req.params.id} id not found`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Data "
            });
          }
        } else res.send(data);
      });
};