//CRUD on config collection inside MongoDb

var procEnv = (process.env.NODE_ENV && process.env.NODE_ENV != '') ? process.env.NODE_ENV : 'development',
    getDb = require('../sgConnect'),
    config = require('../../../config/'+procEnv+'.json'),
    debug = require('debug')('sg-conf');
var ObjectId = require('mongodb').ObjectID;

//add new user
function Roles(data) {
  var d = new Date();
  this.active = true;
  this.enabled = true;
  this.random = Math.random();
  this.created = d.getTime();
  this.createdISO = d.toISOString();
  this.updated = d.getTime();
  this.updatedISO = d.toISOString();
}

Roles.save = function(data, done) {

  // var data = this;
  getDb('socialgraph',function(err, db) {
    if (err) {
      return done(err);
    }
    db.collection('sgRoles').insert(data, function(err, results) {
      if (err) {
        return done(err);
      }
      done(null, results);
    });
  });
};

Roles.findAllRoles = function(query, done) {

  getDb('socialgraph', function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('sgRoles').find(query, function(err, results) {
      if (err) {
        return done(err);
      }
      results.toArray(function(err, items){
        if (err) {
          return done(err);
        }
        done(null, items);
      });
    });
  });
};

Roles.findRole = function(query, done) {

  getDb('socialgraph', function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('sgRoles').findOne(query, function(err, results) {
      if (err) {
        return done(err);
      }
      done(null, results);
    });
  });
};

exports = module.exports = Roles;
