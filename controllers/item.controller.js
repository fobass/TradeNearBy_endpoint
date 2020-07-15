const Item = require("../models/item.model.js")

exports.getItemsNearBy = (req, res) => {
    if (req.headers.lat && req.headers.lon && req.headers.dist) {
        Item.getItemsNearBy(req.headers.lat, req.headers.lon, req.headers.dist, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Items around not found`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving items "
                    });
                }
            } else res.send(data);
        });
    } else res.status(500).send({
        message: "Invalid request "
    });
};

exports.getItemById = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Invalid param"
        });
        return
    }

    Item.getItemById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Item not found with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not get Item with id " + req.params.id
                });
            }
        } else res.send(data);
    });


}

exports.insert = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Item.insert(new Item(req.body), (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Item."
            });
        else res.send(data);
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return
    }
    if (!req.params.id) {
        res.status(400).send({
            message: "Invalid param"
        });
        return
    }

    Item.update(req.params.id, new Item(req.body), (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while updating the Item."
            });
        else res.send(data);
    });
};

exports.uploadmedia = (req, res) => {
    if (!req.params) {
        res.status(400).send({
          message: "Params can not be empty!"
        });
        // return
      }

      Item.uploadmedia(req, (err, data) => {
        if (err) { 
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User not found with id ${req.params.id}`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while uploading files."
                });
            }
        }
        else res.send(data);
      });
  };

exports.delete = (req, res) => {
    if (!req.params) {
        res.status(400).send({
          message: "Params can not be empty!"
        });
        return
      }

    Item.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Item not found with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Item with id " + req.params.id
                });
            }
        } else res.send({ message: `Item was deleted successfully!`, id: req.params.id });
    });
};