'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  // MySQL connection options
  mysql: {
    uri:  process.env.MYSQL_URI ||
          process.env.MYSQL_URL ||
          process.env.OPENSHIFT_MYSQL_DB_URL +
          process.env.OPENSHIFT_APP_NAME ||
          'mysql://localhost/484project'
  }
};
