const { con } = require('../models/conn.db.js')
const multer = require('multer');
const fs = require('fs')
const pathext = require('path')
const mediaFolder = 'media/';




const SellingModelDetail = function (sellingdetail) {
  this.id = sellingdetail.id
  this.uuid = sellingdetail.uuid
  this.title = sellingdetail.title
  this.description = sellingdetail.description
  this.dateadded = sellingdetail.dateadded
  this.price = sellingdetail.price
  this.firstName = sellingdetail.firstName
  this.photoURL = sellingdetail.photoURL
  this.lat = sellingdetail.lat
  this.lon = sellingdetail.lon
  this.viewcount = sellingdetail.viewcount
  this.imagelinks = sellingdetail.imagelinks
}

const SellingModelItem = function (selling) {
  this.id = selling.id
  this.uuid = selling.uuid
  this.title = selling.title
  this.description = selling.description
  this.price = selling.price
  this.imagelink = selling.imagelink
  this.lat = selling.lat
  this.lon = selling.lon
  this.dateadded = selling.dateadded
  this.isactive = selling.isactive
  this.distance = selling.distance
}

const SellingModel = function (selling) {
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
  this.imagecount = selling.imagecount
  
  // this.imagelinks = selling.imagelinks
}

SellingModel.getById = (id, result) => {

  function updateView(sell) {
    console.log(sell)
    con.query("UPDATE selling SET viewcount = ? WHERE id = ?", [++sell.viewcount, id], (err, res) => {
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
    });
  }

  con.query("SELECT s.id, s.title, s.description, s.dateadded, s.price, p.uuid, p.firstName, p.photoURL, s.viewcount, p.lat, p.lon, s.imagelink, s.imagecount FROM selling as s INNER JOIN profile as p ON s.uuID = p.uuID WHERE s.id = ? ", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length > 0) {
      updateView(res[0])
      var linkUrls = []
      var imgLinks = `${mediaFolder}${res[0].uuid}/${res[0].id}`
      fs.readdirSync(imgLinks).forEach(file => {
        console.log(res[0].imagelink + "/api/" + imgLinks + "/" + file);
        linkUrls.push(res[0].imagelink + "/api/" + imgLinks + "/" + file)

      });
    }

    var sellingdetail = [] 
    res.forEach(item => {
      sellingdetail.push(new SellingModelDetail({
        id: item.id,
        uuid: item.uuid,
        title: item.title,
        description: item.description,
        dateadded: item.dateadded,
        price: item.price,
        firstName: item.firstName,
        photoURL: item.photoURL,
        lat: item.lat,
        lon: item.lon,
        viewcount: item.viewcount,
        imagelinks: linkUrls
      }))
    })
    console.log("selling.detail: ", res);
    result(null, sellingdetail);
  });
}

SellingModel.get = (lat, lon, dist, result) => {
  var q = 'SELECT  id, uuid, title, description, price, tags, imagelink, lat,lon,dateadded, isactive, ' +
    '(3959 * acos(cos(radians(' + lat + ')) * cos(radians(lat)) * cos(radians(lon) - radians(' + lon + ')) + ' +
    'sin(radians(' + lat + ')) * sin(radians(lat )))) AS distance FROM selling HAVING distance < ' + dist + ' '

  con.query(q, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // if (res.length > 0) {
     
    //   fs.readdirSync(imgLinks).forEach(file => {
    //     console.log(res[0].imagelink + "/api/" + imgLinks + "/" + file);
    //     linkUrls.push(res[0].imagelink + "/api/" + imgLinks + "/" + file)

    //   });
    // }

    var sellingitems = []
    res.forEach(item => {
      var linkUrls = ""
      var imgLinks = `${mediaFolder}${item.uuid}/${item.id}`
      fs.readdirSync(imgLinks).forEach(file => {
        console.log(item.imagelink + "/api/" + imgLinks + "/" + file);
        if (linkUrls == "") {
          linkUrls = item.imagelink + "/api/" + imgLinks + "/" + file
        }
        //break;
      });


      sellingitems.push(new SellingModelItem({
        id: item.id,
        uuid: item.uuid,
        title: item.title,
        description: item.description,
        price: item.price,
        imagelink: linkUrls,
        lat: item.lat,
        lon: item.lon,
        dateadded: item.dateadded,
        isactive: item.isactive,
        distance: item.distance
      }))
    })

    console.log("profile: ", res);
    result(null, sellingitems);
  });
}

SellingModel.getMy = (uuID, result) => {
  con.query("SELECT * FROM selling  WHERE uuid = ? ", uuID, (err, res) => {
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
      result(null, { message: err.message, id: newSelling.uuid });
      return;
    }

    console.log("New sellingobject was added ", { ...newSelling });
    result(null, { ...newSelling });
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
SellingModel.uploadMedia = (uuid, id, req, result) => {
  const path = `media/${uuid}/${id}`
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      fs.mkdirSync(path, { recursive: true })
      callback(null, path)//(config.const.path.base + config.const.path.productReviewMedia));
    },
    filename: (req, file, callback) => {
      var ext = pathext.extname(file.originalname)
      callback(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ storage: storage }).any('file');

  upload(req, result, (err) => {
    if (err) {
      console.log(err)
      return result(null, { message: err })
      // return result.status(400).send({
      //     message: err
      // });
    }
    let results = req.files.map((file) => {
      return {
        mediaName: file.filename,
        origMediaName: file.originalname,
        mediaSource: 'http://' + req.headers.host + '/' + path + '/' + file.originalname
      }
    });

    // result.status(200).json(results);
    result(null, results);
  });
}


module.exports = SellingModel; 