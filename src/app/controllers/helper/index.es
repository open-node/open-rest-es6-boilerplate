import U from '../../lib/utils';

var modules = U.getModules(__dirname, 'js', ['index', 'defaults']);

module.exports = Object.assign({}, U.rest.helper, modules);
