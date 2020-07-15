const { con } = require('../models/conn.db.js')
const multer = require('multer');
const fs = require('fs')
const pathext = require('path')

const ProfileModel = function Profile(profile) {
    this.uuid = profile.uuid
    this.firstName = profile.firstName
    this.lastName = profile.lastName
    this.pwd = profile.pwd
    this.gender = profile.gender
    this.phoneNumber = profile.phoneNumber
    this.dateOfBirth = profile.dateOfBirth
    this.email = profile.email
    this.photoURL = profile.photoURL
    this.emergencyContact = profile.emergencyContact
    this.isActive = profile.isActive
    this.isVerified = profile.isVerified
    this.verifiedDocID = profile.verifiedDocID
    this.about = profile.about
    this.dateJoined = profile.dateJoined
    this.score = profile.score
    this.lat = profile.lat
    this.lon = profile.lon
    this.commentsID = profile.commentsID
}

ProfileModel.insert = (newProfile, result) => {
    con.query("INSERT INTO profile SET ? ", newProfile, (err, res) => {
        if (err) {
            console.log("error: ", err);
            con.query("UPDATE profile SET photoURL = ?, lat = ?, lon = ? WHERE uuid = ?", [newProfile.photoURL, newProfile.lat, newProfile.lon, newProfile.uuid], (err, res) => {
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

            result(null, { message: err.message, id: newProfile.uuid });
            return 
        }
        const path = `media/${newProfile.uuid}`
        fs.mkdirSync(path, { recursive: true })

        console.log("created new Profile: ", { ...newProfile });
        result(null, { ...newProfile });
    });
}

ProfileModel.get = (uuid, result) => {
    con.query("SELECT * FROM profile WHERE uuid = ?", uuid, (err, res) => {
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

        res[0].isActive = (res[0].isActive == 1)
        res[0].isVerified = (res[0].isVerified == 1)
        console.log("profile: ", res[0]);
        result(null, res[0]);
    });
}

ProfileModel.update = (profile, result) => {
    con.query(
        "UPDATE profile SET uuid = ?, firstName = ?, lastName = ?, pwd = ?, gender = ?, phoneNumber = ?, " +
        "dateOfBirth = ?, email = ?, photoURL = ?, emergencyContact = ?, isActive = ?, isVerified = ?," +
        "verifiedDocID = ?, about = ?, dateJoined = ?, score = ?, lat = ?, lon = ?, commentsID =?  WHERE uuID = ?",
        [profile.uuid, profile.firstName, profile.lastName, profile.pwd, profile.gender, profile.phoneNumber,
        profile.dateOfBirth, profile.email, profile.photoURL, profile.emergencyContact, profile.isActive, profile.isVerified,
        profile.verifiedDocID, profile.about, profile.dateJoined, profile.score, profile.lat, profile.lon, profile.commentsID,
        profile.uuid],
        (err, res) => {
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

            console.log("updated profile: ", { id: profile.uuid, ...profile });
            result(null, { id: profile.uuid, ...profile });
        }
    );
}

ProfileModel.delete = (uuid, result) => {
    con.query('DELETE FROM profile WHERE uuid = ? ', uuid, (err, res) => {
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

        console.log("deleted profile with id: ", uuid);
        result(null, uuid);
    })
}

ProfileModel.uploadMedia = (uuid, req, result) => {
    const path = `media/${uuid}`
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            fs.mkdirSync(path, { recursive: true })
            callback(null, path)//(config.const.path.base + config.const.path.productReviewMedia));
        },
        filename: (req, file, callback) => {
            var ext = pathext.extname(file.originalname)
            callback(null, 'profile' + ext);
        }
    });

    const upload = multer({ storage: storage }).any('file');

    upload(req, result, (err) => {
        if (err) {
            return result.status(400).send({
                message: err
            });
        }
        let results = req.files.map((file) => {
            return {
                mediaName: file.filename,
                origMediaName: file.originalname,
                mediaSource: 'http://' + req.headers.host + '/' + path + '/' + file.filename
            }
        });

        con.query("UPDATE profile SET photoURL = ? WHERE uuid = ?", [results[0].mediaSource, uuid], (err, res) => {
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

        // result.status(200).json(results);
        result(null, results);
    });
}

module.exports = ProfileModel; 