const Location = require("../models/location.model")

exports.get = (req, res) => {
    Location.get(req.query.lat, req.query.lon, req.query.dist, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Location with ${req.body.dist} id not found`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving Member "
            });
          }
        } else res.send(data);
      });
};