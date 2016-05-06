var express = require('express');
var router = express.Router();

var db = require('../models/db');

router.get('/papers', function(req, res) {
  db.findAllPapers(function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/:top', function(req, res) {
  db.findTopPapers(req.params.top, function(err, rows){
    if(err){
      res.status(401).send("No papers found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/title/:title', function(req, res) {
  db.findPapersByTitle(req.params.title, function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/title/:id', function(req, res) {
  db.findPapersById(req.params.id, function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/title/:author', function(req, res) {
  db.findPapersByAuthor(req.params.author, function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/title/:keywords', function(req, res) {
  db.findPapersByKeywords(req.params.keywords, function(err, rows){
    if(err){
      res.status(401).send("No users found");
    }else{
      res.json(rows);
    }
  });
});

module.exports = router;
