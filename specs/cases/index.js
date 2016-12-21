const _ = require('lodash');
const home = require('./home');
const session = require('./session');
const user = require('./user');

module.exports = _.flatten([
  home,
  session,
  user,
]);
