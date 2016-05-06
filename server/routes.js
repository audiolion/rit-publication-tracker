/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

var papers = require('./routes/papers');
var users = require('./routes/users')

export default function(app) {
  // Insert routes below
  app.use('/api', users);
  app.use('/api', papers);

  //All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/api*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}