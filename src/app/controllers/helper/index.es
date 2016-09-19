import U from '../../lib/utils';

var modules = U.getModules(__dirname, 'js', ['index', 'defaults']);

var helper = Object.assign({}, U.rest.helper, modules);

export default helper;
