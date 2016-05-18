var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models/db');
var flash = require('connect-flash')

module.exports = function(passport) {
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done){
    db.findById(id, function(err, rows){
      done(err, rows[0]);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
    db.findByEmail(email, function(err, rows){
      if(err){
        return done(err);
      }
      if(rows.length){
        return done(null, false, req.flash('signupMessage', "Email already taken"));
      } else{
        var newUser = new Object();
        newUser.email = email;
        newUser.password = password;
        newUser.fName = req.body.fName;
        newUser.lName = req.body.lName;
        db.addUser(newUser, function(err, rows){
          //newUser.id = rows.insertId;
          return done(null, rows);
        });
      }
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
    console.log(email, password);
    db.findByEmail(email, function(err, rows){
      if(err){
        console.log(err);
        return done(err);
      }
      if(!rows.length){
        return done(null, false, req.flash('loginMessage', 'User not found'));
      }
      if(!(rows[0].password == password)){
        return done(null, false, req.flash('loginMessage', 'Incorrect password'));
      }
      return done(null, rows[0]);
    });
  }));
};