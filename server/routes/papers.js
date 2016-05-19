var express = require('express');
var router = express.Router();

var db = require('../models/db');

router.get('/papers', function(req, res) {
  db.findAllPapers(function(err, rows){
    if(err){
      res.status(400).send("No papers found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/top/:top', function(req, res) {
  db.findTopPapers(req.params.top, function(err, rows){
    if(err){
      res.status(400).send("No papers found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/title/:title', function(req, res) {
  db.findPapersByTitle(req.params.title, function(err, rows){
    if(err){
      res.status(400).send("No papers found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/id/:id', function(req, res) {
  db.findPapersById(req.params.id, function(err, rows){
    if(err){
      res.status(400).send("No papers found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/author/:author', function(req, res) {
  db.findPapersByAuthor(req.params.author, function(err, rows){
    if(err){
      res.status(400).send("No papers found");
    }else{
      res.json(rows);
    }
  });
});

router.get('/papers/keyword/:keywords', function(req, res) {
  db.findPapersByKeywords(req.params.keywords, function(err, rows){
    if(err){
      res.status(400).send("No papers found");
    }else{
      res.status(200).json(rows);
    }
  });
});

router.post('/papers/', function(req, res) {
  
  db.addPaper(req.body, function(err, rows){
    if(err){
      res.status(400).send("ERR - Paper could not be added");
    }else{
      res.json(rows);
    }
  });
});

router.put('/papers/:id', function(req, res) {
  db.editPaper(req.params.id, req.body, function(err, rows){
    if(err){
      res.status(400).send("ERR - Paper could not be updated");
    }else{
      res.status(201).json(rows);
    }
  });
});

router.put('/papers/viewcount/:id', function(req, res){
  db.updateViewcount(req.params.id, function(err, rows){
    if(err){
      res.status(400).send("ERR - Paper could not be updated");
    }else{
      res.status(201).json(rows);
    }
  });
});

router.delete('/papers/id/:id', function(req, res){
  db.deletePaper(req.params.id, function(err, rows){
    if(err){
      res.status(400).send("ERR - Paper could not be deleted");
    }else{
      res.status(201).send("Paper deleted");
    }
  });
});

module.exports = router;
