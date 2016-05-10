var express = require('express');
var router = express.Router();

var db = require('../models/db');

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

router.post('/users', function(req, res) {
  var email = req.body.email;
  var fName = req.body.fName;
  var lName = req.body.lName;
  var pass = req.body.password;

  var user = {fName: fName, lName: lName, password: pass, email: email};

  db.addUser(user, function(err, rows){
    if(err){
      res.status(401).send("Unsuccessful");
    }else{
      res.json(rows);
    }
  });
});

router.put('/users/:uid', function(req, res) {
  var email = req.body.email;
  var pass = req.body.password;

  var user = { email: email, password: pass };
  db.updateById(req.params.uid, user, function(err, rows){
    if(err){
      res.status(401).send("Unsuccessful");
    }else{
      res.json(rows);
    }
  });
});

router.delete('/users/:uid', function(req, res) {

  db.removeById(req.params.uid, function(err, rows){
      if(err){
        res.status(401).send("Unsuccessful");
      }else{
        res.status(204);
      }
  });
});

module.exports = router;
