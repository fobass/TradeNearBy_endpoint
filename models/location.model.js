const { con } = require('../models/conn.db.js')

const LocationModel = function LocationModel(location) {
    this.id = location.id
    this.city = location.city
    this.country = location.country
    this.iso2 = location.iso2
    this.distance = location.distance
}

LocationModel.get = (lat, lon, dist, result) => {
    con.query("SELECT id, city, country, iso2, (3959 * acos(cos(radians(" + lat + ")) * cos(radians(lat)) * " + 
    " cos(radians(lng) - radians(" + lon + ")) + sin(radians(" + lat + ")) * sin(radians(lat )))) AS distance FROM cities " +
    " HAVING distance < " + dist + " ", (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("profile: ", res);
        result(null, res);
      });
}

module.exports = LocationModel; 