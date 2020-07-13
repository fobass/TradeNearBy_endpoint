const { con } = require('../models/conn.db.js')

const SellingItemModel = function (selling) {
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
    this.viewcount = selling.viewcount
}

SellingItemModel.getById = (id, result) => {

    function updateView() {
        con.query("UPDATE selling SET viewcount = ? WHERE id = ?", [id, ], (err, res) => {
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
        }
        );
    }

    con.query("SELECT * FROM selling  WHERE id = ? ", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
       // res.filter(x => x.id === element.id);
        console.log("selling.detail: ", res);
        result(null, res);
    });
}