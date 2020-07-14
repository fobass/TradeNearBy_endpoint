const { con } = require('../models/conn.db.js')

const ItemModel = function (item) {
    this.id = item.id
    this.uuid = item.uuid
    this.title = item.title
    this.description = item.description
    this.price = item.price
    this.imagelink = item.imagelink
    this.lat = item.lat
    this.lon = item.lon
    this.dateadded = item.dateadded
    this.views = item.views
    this.sold = item.sold
    this.reviewid = item.reviewid
}

ItemModel.update = (id, item, result) => {
    con.query("UPDATE items SET title = ?, description = ?, price = ?, imagelink = ?, lat = ?, lon = ?, sold = ? WHERE id = ?",
        [item.title, item.description, item.price, item.imagelink, item.lat, item.lon, item.sold, id], (err, res) => {
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

            console.log("updated item: ", { id: id, ...item });
            result(null, { id: id, ...item });
        }
    );
}

ItemModel.getItemsNearBy = (lat, lon, dist, result) => {
    var q = 'SELECT  id, title, description, price, imagelink, lat, lon, (3959 * acos(cos(radians(' + lat + ')) '
        + '* cos(radians(lat)) * cos(radians(lon) - radians(' + lon + ')) + sin(radians(' + lat + ')) * '
        + ' sin(radians(lat )))) AS distance FROM items HAVING distance < ' + dist + ' '
    con.query(q, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    })
}

ItemModel.getItemById = (id, result) => {
    con.query('SELECT * FROM items WHERE id = ? ', id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.length == 0) {
            // not found Customer with the id
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, res[0]);
    })
}

ItemModel.insert = (newItem, result) => {
    con.query("INSERT INTO items SET ? ", newItem, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, { message: err.message, id: newItem.uuid });
            return;
        }

        console.log("New item was added ", { ...res });
        result(null, { ...newItem });
    });
}

ItemModel.delete = (id, result) => {
    con.query('DELETE FROM items WHERE id = ? ', id, (err, res) => {
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

        console.log("deleted item with id: ", id);
        result(null, id);
    })
}

module.exports = ItemModel; 