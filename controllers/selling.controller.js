const Selling = require("../models/selling.model.js")


exports.getItemsNearBy = (req, res) => {
  Selling.getById(req.params.id, (err, data) => {
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
}

exports.getById = (req, res) => {
  Selling.getById(req.params.id, (err, data) => {
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

exports.get = (req, res) => {
  // var lat = req.headers.lat 
  // var lon = req.headers.lon 
  // var dist = req.headers['dist']
    Selling.get(req.query.lat, req.query.lon, req.query.dist, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Sellings with ${req.params.dist} id not found`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Data "
          });
        }
      } else res.send(data);
    });
  
};

exports.getMy = (req, res) => {
  Selling.getMy(req.params.uuID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Sellings with ${req.params.dist} id not found`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Data "
        });
      }
    } else res.send(data);
  });
};

exports.insert = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Save trip in the database
  Selling.insert(new Selling(req.body), (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Selling."
      });
    else res.send(data);
  });
};

exports.delete = (req, res) => {
  Selling.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Selling with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Selling with id " + req.params.id
        });
      }
    } else res.send({ message: `Selling was deleted successfully!`, id: req.params.id });
  });
};

exports.uploadMedia = (req, res) => {
  if (!req.params) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Save trip in the database
  Selling.uploadMedia(req.params.uuid, req.headers.id, req, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Selling."
      });
    else res.send(data);
  });
}