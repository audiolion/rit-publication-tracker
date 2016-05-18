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

    var sql = "SELECT * FROM users WHERE id = ?";

    conn.query(sql, [id], function(err, rows){
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
    
    var sql = "SELECT id, fName, lName, email, password FROM users WHERE email = ?";

    conn.query(sql, [email], function(err, rows){
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

    var sql = "SELECT id, CONCAT(fName, ' ', lName) AS name, email FROM users WHERE CONCAT_WS(' ',fName,lName) REGEXP '" + name + "'";

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

    var returnId;

    conn.beginTransaction(function(err) {
      if(err){
        throw err;
      }

      var sqlId = "SELECT MAX(id) AS id FROM users";

      var pid;
      conn.query(sqlId, function(err, id){
        if(err){
          return conn.rollback(function(){
            throw err;
          });
        }
        pid = id[0].id;
        pid = pid + 1;
        returnId = pid;

        var sql = "INSERT INTO users (id, fName, lName, password, email) VALUES (?,?,?,?,?)";

        conn.query(sql, [pid, user.fName, user.lName, user.password, user.email], function(err, rows){
          if(err){
              return conn.rollback(function(){
                throw err;
              });
          }
          conn.commit(function(err){
            conn.release();
            if(err){
              return conn.rollback(function(){
                throw err;
              });
            }
            callback(false, {id: [returnId] });
          });
        });
      });
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

    var sql = "UPDATE users SET email = ?, password = ? WHERE id = ?";

    conn.query(sql, [user.email, user.password, id], function(err, rows){
      conn.release();
      if(err){
        console.log(err);
        callback(true);
        return;
      }
    });
    callback(false, { message: "Information updated" });
  });
};

exports.removeById = function(id, callback) {
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    var sql = "DELETE FROM users WHERE id = ?";

    conn.query(sql, [id], function(err, rows){
      console.log(sql);
      conn.release();
      if(err){
        throw err;
      }
    });
    callback(false, { message: "User deleted"});
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
    top = parseInt(top);
    console.log(typeof(top));
    var sql = "SELECT papers.id, title, abstract, citation, views FROM papers ORDER BY views DESC LIMIT ?";
    console.log(sql);

    conn.query(sql, [top], function(err, papers){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      if(papers.length < 1){
        callback(false, {});
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

        sql = "SELECT id, keyword from paper_keywords WHERE id IN " + ids;

        conn.query(sql, function(err, keywords){
          if(err){
            console.log(err);
            callback(true);
            return;
          }

          for(var i = 0; i < papers.length; i++){
            var pid = papers[i]['id'];
            var keywordsArr = [];
            for(var j = 0; j < keywords.length; j++){
              if(keywords[j]['id'] === pid){
                keywordsArr.push(keywords[j]['keyword']);
              }
            }
            papers[i]['keywords'] = keywordsArr;
          }

          callback(false, papers);
        });
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

    var sql = "SELECT id, title, abstract, citation, views FROM papers WHERE id = ?";

    conn.query(sql, [id], function(err, rows){
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

    var title_wild = "\%" + title + "\%";

    var sql = "SELECT papers.id, title, abstract, citation, views FROM papers WHERE title LIKE " + pool.escape(title_wild) + " ORDER BY views DESC";
    console.log(sql);
    conn.query(sql, function(err, papers){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      if(papers.length < 1){
        callback(false, {});
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
        for(var i = 0; i < papers.length; i++){
          var pid = papers[i]['id'];
          var authorsArr = [];
          for(var j = 0; j < authors.length; j++){
            if(authors[j]['id'] === pid){
              authorsArr.push(authors[j]['author']);
            }
          }
          papers[i]['authors'] = authorsArr.join(', ');
        }

        sql = "SELECT id, keyword from paper_keywords WHERE id IN " + ids;

        conn.query(sql, function(err, keywords){
          if(err){
            console.log(err);
            callback(true);
            return;
          }

          for(var i = 0; i < papers.length; i++){
            var pid = papers[i]['id'];
            var keywordsArr = [];
            for(var j = 0; j < keywords.length; j++){
              if(keywords[j]['id'] === pid){
                keywordsArr.push(keywords[j]['keyword']);
              }
            }
            papers[i]['keywords'] = keywordsArr.join(', ');
          }

          callback(false, papers);
        });
      });
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

    var splitKeywords = replace(keywords, /,\s+/g, ',');
    splitKeywords = replace(splitKeywords, /['"]/g, '');
    splitKeywords = replace(splitKeywords, /,/g, '.*|.*');
    splitKeywords = ".*" + splitKeywords;

    var sql = "SELECT DISTINCT papers.id, title, abstract, citation, views FROM papers INNER JOIN paper_keywords ON papers.id = paper_keywords.id WHERE paper_keywords.keyword REGEXP " + pool.escape(splitKeywords) + " ORDER BY views DESC";
    console.log(sql);
    conn.query(sql, function(err, papers){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      if(papers.length < 1){
        callback(false, {});
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
        for(var i = 0; i < papers.length; i++){
          var pid = papers[i]['id'];
          var authorsArr = [];
          for(var j = 0; j < authors.length; j++){
            if(authors[j]['id'] === pid){
              authorsArr.push(authors[j]['author']);
            }
          }
          papers[i]['authors'] = authorsArr.join(', ');
        }

        sql = "SELECT id, keyword from paper_keywords WHERE id IN " + ids;

        conn.query(sql, function(err, keywords){
          if(err){
            console.log(err);
            callback(true);
            return;
          }

          for(var i = 0; i < papers.length; i++){
            var pid = papers[i]['id'];
            var keywordsArr = [];
            for(var j = 0; j < keywords.length; j++){
              if(keywords[j]['id'] === pid){
                keywordsArr.push(keywords[j]['keyword']);
              }
            }
            papers[i]['keywords'] = keywordsArr.join(', ');
          }

          callback(false, papers);
        });
      });
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

    var splitName = replace(name, /,\s+/g, ',');
    splitName = replace(splitName, /['"]/g, '');
    splitName = replace(splitName, /,/g, '.*|.*');
    splitName = ".*" + splitName;

    var sql = "SELECT DISTINCT papers.id, title, abstract, citation, views FROM papers INNER JOIN authorship ON papers.id = authorship.paperId INNER JOIN users ON authorship.userId = users.id WHERE CONCAT_WS(' ',fName,lName) REGEXP " + pool.escape(splitName) + " ORDER BY views DESC";

    conn.query(sql, function(err, papers){
      if(err){
        console.log(err);
        callback(true);
        return;
      }
      if(papers.length < 1){
        callback(false, {});
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
        for(var i = 0; i < papers.length; i++){
          var pid = papers[i]['id'];
          var authorsArr = [];
          for(var j = 0; j < authors.length; j++){
            if(authors[j]['id'] === pid){
              authorsArr.push(authors[j]['author']);
            }
          }
          papers[i]['authors'] = authorsArr.join(', ');
        }

        sql = "SELECT id, keyword from paper_keywords WHERE id IN " + ids;

        conn.query(sql, function(err, keywords){
          if(err){
            console.log(err);
            callback(true);
            return;
          }

          for(var i = 0; i < papers.length; i++){
            var pid = papers[i]['id'];
            var keywordsArr = [];
            for(var j = 0; j < keywords.length; j++){
              if(keywords[j]['id'] === pid){
                keywordsArr.push(keywords[j]['keyword']);
              }
            }
            papers[i]['keywords'] = keywordsArr.join(', ');
          }

          callback(false, papers);
        });
      });
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

    
    
    conn.beginTransaction(function(err) {
      if(err){
        throw err;
      }

      var sqlId = "SELECT MAX(id) AS id FROM papers";

      var pid;
      conn.query(sqlId, function(err, id){
        if(err){
          return conn.rollback(function(){
            throw err;
          });
        }
        pid = id[0].id;
        pid = pid + 1;
        var sql = "INSERT INTO papers (id, title, abstract, citation, views) VALUES (?,?,?,?,?)"
      
        conn.query(sql, [pid, paper.title, paper.abstract, paper.citation, 0], function(err, rows){
          if(err){
            return conn.rollback(function(){
              throw err;
            });
          }
          var keywords = replace(paper.keywords, /,\s+/g, ',');
          keywords = keywords.split(",");
          var keywords_formatted = "";
          for(var i = 0; i < keywords.length; i++){
            keywords_formatted += "(" + pid + "," + "'" + keywords[i] + "')";
            if(i+1 < keywords.length){
              keywords_formatted += ",";
            }
          }

          sql = "INSERT INTO paper_keywords (id, keyword) VALUES " + keywords_formatted;
          
          conn.query(sql, function(err, rows){
            if(err){
              return conn.rollback(function(){
                throw err;
              });
            }
          });
          var sqlId = "SELECT id FROM users WHERE email = ?";
          console.log(sql);
          var uid;
          conn.query(sqlId, [paper.email], function(err, id){
            if(err){
              return conn.rollback(function(){
                throw err;
              });
            }
            uid = id[0].id;
            sql = "INSERT INTO authorship (userId, paperId) VALUES (?,?)";

            conn.query(sql, [uid, pid], function(err, rows){
              if(err){
                return conn.rollback(function(){
                  throw err;
                });
              }
              conn.commit(function(err){
                conn.release();
                if(err){
                  return conn.rollback(function(){
                    throw err;
                  });
                }
                callback(false, {message: "Paper added"});
              });
            });
          });
        });
      });
    });
  });
};

exports.updateViewcount = function(id, callback){
  pool.getConnection(function(err, conn){
    if(err){
      console.log(err);
      callback(true);
      return;
    }

    // id = parseInt(id);
    console.log(id, typeof(id));
    var sql = "UPDATE papers SET views = views + 1 WHERE id = ?";

    conn.query(sql, [id], function(err, rows){
      if(err){
        throw err;
      }
    });

    callback(false, {message: "Updated viewcount"});
  });
};