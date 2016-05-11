'use strict';

import express from 'express';
import http from 'http';
import config from './config/environment';
import passport from 'passport';

var app = express();
var server = http.createServer(app);

var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/passport')(passport);
require('./config/express')(app);
require('./routes')(app, passport);



function startServer() {
  app.publicationTracker = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
};

setImmediate(startServer);

exports = module.exports = app;
