var fs = require("fs");
var path = require("path");
var mysql = require("mysql");
var replace = require('lodash/replace');
var split = require('lodash/split');
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, 'database.json'))[env];

var pool = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

var getValsByKey = function (arr, key) {
        var values = [];
        for(var i = 0; i < arr.length; i++){
          values.push(arr[i][key]);
        }
        return values;
      };

exports.findAllUsers = function(callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT * FROM users";

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.findById = function(id, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT * FROM users WHERE id = " + conn.escapeId(id);

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.findByEmail = function(email, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT id, fName, lName, email FROM users WHERE email = " + conn.escapeId(email);

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.findByName = function(name, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT id, CONCAT(fName, ' ', lName) AS name, email FROM users WHERE name LIKE " + conn.escapeId(name);

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.addUser = function(user, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "INSERT INTO users (fName, lName, password, email) VALUES (" + conn.escapeId(user.fName) + "," + conn.escapeId(user.lName) + "," + conn.escapeId(user.password) + "," + conn.escapeId(user.email) + ")";

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, { message: "User added" });
    });
  });
};

exports.updateById = function(id, user, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "UPDATE users SET email = " + conn.escapeId(user.email) + ", password = " + conn.escapeId(user.password) + "WHERE id = " + conn.escapeId(id);

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, { message: "Information updated" });
    });
  });
};

exports.removeById = function(id, user, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "DELETE FROM users WHERE id = " + conn.escapeId(id);

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, { message: "User deleted" });
    });
  });
};

exports.findAllPapers = function(callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT id, title, abstract, citation, views FROM papers";

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.findTopPapers = function(top, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT papers.id, title, abstract, citation, views FROM papers ORDER BY views DESC LIMIT " + top;

    conn.query(sql, function(err, papers){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      
      var ids = "(" + getValsByKey(papers, 'id').toString() + ")";
      sql = "SELECT paperId AS id, CONCAT(fName, ' ', lName) AS author from authorship INNER JOIN users ON authorship.userId = users.id WHERE authorship.paperId IN " + ids;
      
      conn.query(sql, function(err, authors){
        if(err){
          console.log(err);
          callback(true);
          return;
        }
        console.dir(authors);
        for(var i = 0; i < papers.length; i++){
          var pid = papers[i]['id'];
          var authorsArr = [];
          for(var j = 0; j < authors.length; j++){
            if(authors[j]['id'] === pid){
              authorsArr.push(authors[j]['author']);
            }
          }
          papers[i]['authors'] = authorsArr;
        }
        console.dir(papers);
        // TODO: add keywords
        callback(false, papers);
      });
    });
  });
};

exports.findPapersById = function(id, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT id, title, abstract, citation, views FROM papers WHERE id = " + conn.escapeId(id);

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.findPapersByTitle = function(title, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT id, title, abstract, citation CONCAT(fName, ' ', lName) AS author, email, keyword, views FROM papers INNER JOIN authorship ON papers.id = authorship.paperId INNER JOIN users ON users.id = authorship.userId INNER JOIN paper_keywords ON papers.id = paper_keywords.id WHERE title LIKE " + conn.escapeId(title);

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.findPapersByKeywords = function(keywords, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    splitKeywords = replace(splitKeywords, /\s/g, '');
    splitKeywords = replace(splitKeywords, /['"]/g, '');
    splitKeywords = replace(splitKeywords, /,/g, '\',\'');
    splitKeywords = "'" + splitKeywords + "'";
    var sql = "SELECT id, title, abstract, citation, CONCAT(fName, ' ', lName) AS author, email, keyword FROM papers INNER JOIN authorship ON papers.id = authorship.paperId INNER JOIN users ON users.id = authorship.userId INNER JOIN paper_keywords ON papers.id = paper_keywords.id WHERE paper_keywords.keyword IN (" + conn.escapeId(splitKeywords) + ")";

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.findPapersByAuthor = function(name, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "SELECT id, title, abstract, citation CONCAT(fName, ' ', lName) AS author, email, keyword FROM papers INNER JOIN authorship ON papers.id = authorship.paperId INNER JOIN users ON users.id = authorship.userId INNER JOIN paper_keywords ON papers.id = paper_keywords.id WHERE author LIKE " + conn.escapeId(name);

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, rows);
    });
  });
};

exports.addPaper = function(paper, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }
    //needs to be a transaction
    var sqlId = "SELECT MAX(id) AS id FROM papers";

    var pid;
    conn.query(sqlId, function(err, id){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      pid = id;
    });

    pid = pid + 1;

    var sql = "INSERT INTO papers (id, title, abstract, citation) VALUES (" + conn.escapeId(id) + "," + conn.escapeId(paper.title) + "," + conn.escapeId(paper.abstract) + "," + conn.escapeId(paper.citation) + ")"

    conn.query(sql, function(err, rows){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
    });

    keywords = replace(paper.keywords, /(')[a-zA-Z].*?(')/, '(' + id + ',$1 through $99)');
    splitKeywords = "'" + splitKeywords + "'";

    sql = "INSERT INTO paper_keywords (id, keyword) VALUES " + keywords;

    conn.query(sql, function(err, rows){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
    });

    sqlId = "SELECT id FROM users WHERE email = " + conn.escapeId(paper.email);
    var uid;
    conn.query(sqlId, function(err, id){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      uid = id;
    });

    sql = "INSERT INTO authorship (userId, paperId) VALUES (" + conn.escapeId(uid) + "," + conn.escapeId(pid) + ")";

    conn.query(sql, function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      callback(false, {message: "Paper added"});
    });
  });
};
