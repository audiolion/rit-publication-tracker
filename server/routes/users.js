var express = require('express');
var router = express.Router();

var db = require('../models/db');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/users', function(req, res) {
  db.findAllUsers(function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/users/id/:uid', function(req, res) {
  db.findById(req.params.uid, function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/users/email/:email', function(req, res) {
  db.findByEmail(req.params.email, function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/users/name/:name', function(req, res) {
  db.findByName(req.params.name, function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

router.post('/users/register', passport.authenticate('local-signup'), function(req, res) {
  res.status(200).json({status: true, message: req.flash('signupMessage')});
});

router.post('/users/login', passport.authenticate('local-login'), function(req, res){
  res.status(200).json({status: true});
});

router.get('/users/status', function(req, res){
  if(!req.isAuthenticated()){
    return res.status(200).json({status: false});
  }
  res.status(200).json({status: true});
});

router.get('/dashboard', function(req, res){
  //return list of users publications
  if(req.isAuthenticated()){
    res.status(200).json({user: req.user});
  }
});

router.put('/users/:uid', function(req, res) {
  var email = req.body.email;
  var pass = req.body.password;

  var user = { email: email, password: pass };
  db.updateById(req.params.uid, user, function(err, rows){
    if(err){
      res.status(401).send("Unsuccessful");
    }else{
      res.status(201).json(rows);
    }
  });
});

router.delete('/users/:uid', function(req, res) {

  db.removeById(req.params.uid, function(err, rows){
      if(err){
        res.status(401).send("Unsuccessful");
      }else{
        res.status(204).json(rows);
      }
  });
});

module.exports = router;
