//CRUD on config collection inside MongoDb

var procEnv = (process.env.NODE_ENV && process.env.NODE_ENV != '') ? process.env.NODE_ENV : 'development',
    getDb = require('../sgConnect'),
    config = require('../../../config/'+procEnv+'.json'),
    debug = require('debug')('sg-conf');
var ObjectId = require('mongodb').ObjectID;

function Access(data) {
  var d = new Date();
  this.active = true;
  this.enabled = true;
  this.random = Math.random();
  this.created = d.getTime();
  this.createdISO = d.toISOString();
  this.updated = d.getTime();
  this.updatedISO = d.toISOString();
}

Access.save = function(data, done) {

  // var data = this;
  getDb('socialgraph',function(err, db) {
    if (err) {
      return done(err);
    }
    db.collection('sgAccess').insert(data, function(err, results) {
      if (err) {
        return done(err);
      }
      done(null, results);
    });
  });
};

Access.findAccess = function(query, done) {

  getDb('socialgraph', function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('sgAccess').findOne(query, function(err, results) {
      if (err) {
        return done(err);
      }
      done(null, results);
    });
  });
};

Access.findAllAccess = function(query, done) {

  getDb('socialgraph', function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('sgAccess').find(query, function(err, results) {
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

Access.update = function(query, option, done) {

  getDb('socialgraph', function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('sgAccess').update(query, option, function(err, results) {
      if (err) {
        return done(err);
      }

      done(null, results);
    });
  });
};
exports = module.exports = Access;
