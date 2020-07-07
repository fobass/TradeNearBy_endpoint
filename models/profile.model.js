const { con } = require('../models/conn.db.js')

const ProfileModel = function Profile(profile) {
    this.uuID = profile.uuID
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
            result(null, {message: err.message, id: newProfile.uuID});
            return;
        }

        console.log("created new Profile: ", {...newProfile });
        result(null, {...newProfile });
    });
}

ProfileModel.get = (uuID, result) => {
    con.query("SELECT * FROM profile WHERE uuID = ?", uuID, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        res[0].isActive = (res[0].isActive == 1)
        res[0].isVerified = (res[0].isVerified == 1)
        console.log("profile: ", res);
        result(null, res);
      });
}

ProfileModel.update = (profile, result) => {
    con.query(
        "UPDATE profile SET uuID = ?, firstName = ?, lastName = ?, pwd = ?, gender = ?, phoneNumber = ?, " +
        "dateOfBirth = ?, email = ?, photoURL = ?, emergencyContact = ?, isActive = ?, isVerified = ?," +
        "verifiedDocID = ?, about = ?, dateJoined = ?, score = ?, lat = ?, lon = ?, commentsID =?  WHERE uuID = ?",
        [profile.uuID, profile.firstName, profile.lastName, profile.pwd, profile.gender, profile.phoneNumber,
        profile.dateOfBirth, profile.email, profile.photoURL, profile.emergencyContact, profile.isActive, profile.isVerified,
        profile.verifiedDocID, profile.about, profile.dateJoined, profile.score, profile.lat, profile.lon, profile.commentsID,
        profile.uuID],
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

            console.log("updated profile: ", { id: profile.uuID, ...profile });
            result(null, { id: profile.uuID, ...profile });
        }
    );
}

ProfileModel.delete = (uuID, result) => {
    con.query('DELETE FROM profile WHERE uuID = ? ', uuID, (err, res) => {
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
      
          console.log("deleted profile with id: ", uuID);
          result(null, uuID);
    })
}

module.exports = ProfileModel; 