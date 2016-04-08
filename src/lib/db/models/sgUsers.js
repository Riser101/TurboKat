//CRUD on config collection inside MongoDb

var procEnv = (process.env.NODE_ENV && process.env.NODE_ENV != '') ? process.env.NODE_ENV : 'development',
    getDb = require('../sgConnect'),
    config = require('../../../config/'+procEnv+'.json'),
    debug = require('debug')('sg-conf');


function Users(data) {
  var d = new Date();
  this.active = true;
  this.enabled = true;
  this.random = Math.random();
  this.created = d.getTime();
  this.createdISO = d.toISOString();
  this.updated = d.getTime();
  this.updatedISO = d.toISOString();
}

//add new user
Users.save = function(data, done) {

  // var data = this;
  getDb('socialgraph',function(err, db) {
    if (err) {
      return done(err);
    }
    db.collection('sgUsers').insert(data, function(err, results) {
      if (err) {
        return done(err);
      }
      done(null, results);
    });
  });
};

//find a user
Users.findUser = function(query, done) {

  getDb('socialgraph', function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('sgUsers').findOne(query, function(err, results) {
      if (err) {
        return done(err);
      }
      done(null, results);
    });
  });
};

//find all users
Users.findAllUser = function(query, done) {

  getDb('socialgraph', function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('sgUsers').find(query, function(err, results) {
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

//update user details
Users.update = function(query, option, done) {

  getDb('socialgraph', function(err, db) {
    if (err) {
      return done(err);
    }

    db.collection('sgUsers').update(query, option, function(err, results) {
      if (err) {
        return done(err);
      }

      done(null, results);
    });
  });
};

exports = module.exports = Users;
