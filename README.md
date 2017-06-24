# open-rest-es6-boilerplate
Open-rest es6 boilerplate

[![Build status](https://api.travis-ci.org/open-node/open-rest-es6-boilerplate.svg?branch=master)](https://travis-ci.org/open-node/open-rest-es6-boilerplate)
[![codecov](https://codecov.io/gh/open-node/open-rest-es6-boilerplate/branch/master/graph/badge.svg)](https://codecov.io/gh/open-node/open-rest-es6-boilerplate)

## Quick start
<pre>
  git clone git@github.com:open-node/open-rest-es6-boilerplate.git yourApp
  cd yourApp
  npm run setup
</pre>

## Feature list
- [x] [eslint airbnb](https://github.com/airbnb/javascript)
- [x] [open-rest@8.0.0](https://github.com/open-node/open-rest)
- [x] [open-i18n@0.4.0](https://github.com/open-node/open-i18n)
- [x] [open-rest-access-log@1.0.0](https://github.com/open-node/open-rest-access-log)
- [x] [open-rest-with-mysql@0.1.1](https://github.com/open-node/open-rest-with-mysql)
- [x] [open-rest-helper-getter@1.0.0](https://github.com/open-node/open-rest-helper-getter)
- [x] [open-rest-helper-rest@2.0.0](https://github.com/open-node/open-rest-helper-rest)
- [x] [open-rest-helper-assert@1.0.0](https://github.com/open-node/open-rest-helper-assert)
- [x] [open-rest-helper-params@1.0.0](https://github.com/open-node/open-rest-helper-params)
- [x] [open-cache@0.4.0](https://github.com/open-node/open-cache)
- [x] [restspec@3.0.0](https://github.com/open-node/restspec)
- [x] [Mochajs](https://mochajs.org/)

## npm run *
  * `eslint` Exec eslint validate use airbnb rule
  * `_test` Only exec test, without coverage report & eslint
  * `test` Run test unit case && api test case then output coverage report
  * `apidoc` Make api docs, base on apidocs
  * `start` Start rest api with development mode
  * `locale:read` Collect language items
  * `locale:write` Make language packages
  * `setup` install config & db
