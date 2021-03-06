/**
 * Project: HSR CAS FEE 2017, Project 02 - give-it-away application.
 * Content: Contains service methods for user registration and authentification.
 * Created on: 12.12.2017
 * Author: Saidul Hofmann
 */

const crypto = require('crypto');
const cryptoUtil = require('../util/cryptoUtil');
const Datastore = require('nedb');

const db = new Datastore({filename: './data/user.db', autoload: true});
db.ensureIndex({fieldName: 'email', unique: true});


function User(email, passwort) {
    this.email = email;
    this.passwortHash = cryptoUtil.hashPwd(passwort);
}


function publicRegisterUser(email, passwort, callback) {
    if (!(email && passwort)) {
        callback("no user", null);
    }

    let user = new User(email, passwort);
    db.insert(user, function (err, newDoc) {
        if (callback) {
            callback(err, newDoc);
        }
    });
}

function publicAuthentication(email, passwort, callback) {
    if (!(email && passwort)) {
        callback(false);
    }


    db.findOne({email: email}, function (err, doc) {
        if (doc == null && !err) {
            publicRegisterUser(email, passwort, callback);
        }
        else {
            callback(err, doc && doc.passwortHash == cryptoUtil.hashPwd(passwort));
        }
    });
}

module.exports = {add: publicRegisterUser, authenticate: publicAuthentication};