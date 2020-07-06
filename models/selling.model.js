const { con } = require('../models/conn.db.js')

const SellingModel = function(selling){
    this.id = selling.id
    this.uuid = selling.uuid
    this.title = selling.title
    this.description = selling.description
    this.price = selling.price
    this.tags = selling.tags
    this.imagelink = selling.imagelink
    this.lat = selling.lat
    this.lon = selling.lon
    this.dateadded = selling.dateadded
    this.isactive = selling.isactive
}

SellingModel.get = (lat, lon, dist, result) => {
    con.query("SELECT * FROM selling ", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        console.log("profile: ", res);
        result(null, res);
      });
}

SellingModel.insert = (newSelling, result) => {
    con.query("INSERT INTO selling SET ? ", newSelling, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, {message: err.message, id: newSelling.uuid});
            return;
        }

        console.log("New sellingobject was added ", {...newSelling });
        result(null, {...newSelling });
    });
}

SellingModel.delete = (id, result) => {
    con.query('DELETE FROM selling WHERE id = ? ', id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
      
          if (res.affectedRows == 0) {
            // not found Customer with the id
            result({ kind: "not_found" }, null);
            return;
          }
      
          console.log("deleted selling with id: ", id);
          result(null, id);
    })
}

module.exports = SellingModel; 