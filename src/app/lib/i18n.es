/** 返回 i18n 对象 */
export default function (languages, locale, locales) {
  var langs;
  locale = (languages.indexOf(locale) > -1) ? locale : languages[0];
  langs = locales[locale] || {};
  return {
    /**
     * key "nihao {0}, Today is {1}"
     * i18n.t key, 'zhaoxiongfei', '星期三'
     */
    t: function(key) {
      var result, args;
      args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
      if (!key) return;
      /**
       * 参数如果只有两个的话，第二个就是要替换的数组
       * 之所以这么写是为了支持两种用啊
       * 1. i18n.t("Language key {0}, {1}", "Hello", "world")
       * 2. i18n.t("Language key {0}, {1}", ["Hello", "world"])
       */
      if ((arguments.length == 2) && Array.isArray(arguments[1])) {
        args = arguments[1];
      }
      result = langs[key] || key;
      if (!args.length) return result;
      return result.replace(/\{(\d+)\}/g, (m, i) => args[i]);
    }
  };
};
