import U from '../../lib/utils';

var modules = U.getModules(__dirname, 'js', ['index', 'defaults']);

export default Object.assign({}, U.rest.helper, modules);
