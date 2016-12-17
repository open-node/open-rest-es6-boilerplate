const U = require('../../lib/utils');

const modules = U.getModules(__dirname, 'js', ['index', 'defaults']);

module.exports = Object.assign({}, U.rest.helper, modules);
