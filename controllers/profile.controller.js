const Profile = require("../models/profile.model")

exports.get = (req, res) => {
  Profile.get(req.params.uuid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Profile with ${req.params.uuid} id not found`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Member "
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
  Profile.insert(new Profile(req.body), (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Profile."
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Profile.update(new Profile(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Profile with id ${req.body.uuid}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating Profile with id " + req.body.uuid
        });
      }
    } else res.send(data);
  }
  );
};


exports.delete = (req, res) => {
  Profile.delete(req.params.uuid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Profile with id ${req.params.uuid}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Profile with id " + req.params.uuid
        });
      }
    } else res.send({ message: `Profile was deleted successfully!`, id: req.params.uuid });
  });
};

exports.uploadMedia = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Save trip in the database
  Profile.uploadMedia(req.params.uuid, req, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Selling."
      });
    else res.send(data);
  });
}