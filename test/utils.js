const assert  = require('assert');
const U       = require('../app/lib/utils');

const base64image = 'data:image/gif;base64,R0lGODdhBQAFAIACAAAAAP/eACwAAAAABQAFAAACCIwPkWerClIBADs=';

describe('Utils', function() {

  const privateIpMerge = U.privateIpMerge;

  describe('#privateIpMerge', function() {
    const switchs = {
      // 1. adServing 投放服务器5
      adServing: ['campaign', 'campaigns', 'placements', 'creatives', 'advertisements'],
      // 2. 采集扩充机器
      collectExpand: ['placement', 'campaigns'],
      // 3. v5.databank
      v5Databank: ['campaigns', 'placements', 'creatives', 'keywords'],
      // 4. 更新点击字典
      updateClickDict: ['campaigns', 'placements', 'creatives']
    };

    it("单个ip返回单元素数组", function(done) {
      assert.deepEqual({
        '10.20.20.14': [
          'campaigns', 'placements', 'creatives'
        ]
      }, privateIpMerge(switchs, {
        updateClickDict: [
          '10.20.20.14'
        ]
      }));
      done();
    });
    it('多ip返回多元素的数组', function(done) {
      assert.deepEqual({
        '10.20.20.14': [
          'campaigns', 'placements', 'creatives', 'keywords'
        ],
        "10.20.20.146": [
          'campaigns', 'placements', 'creatives', 'keywords'
        ],
        "10.20.20.153": [
          'campaign', 'campaigns', 'placements', 'creatives', 'advertisements'
        ]
      }, privateIpMerge(switchs, {
        v5Databank: [
          '10.20.20.14',
          '10.20.20.146'
        ],
        adServing: [
          '10.20.20.153'
        ]
      }));
      done();
    });
    it("单ip有重复的元素应当去重", function(done) {
      assert.deepEqual({
        '10.20.20.14': [
          'campaigns','placements','creatives','keywords','campaign','advertisements'
        ]
      }, privateIpMerge(switchs, {
        v5Databank: [
          '10.20.20.14'
        ],
        adServing: [
          '10.20.20.14'
        ]
      }));
      done();
    });
    it("多个ip而且有重复的元素应当返回多元素且去重的数组", function(done) {
      assert.deepEqual({
        '10.20.20.14': [
          'campaigns','placements','creatives','keywords','campaign','advertisements'
        ],
        '10.20.20.146': [
          'campaigns', 'placements', 'creatives', 'keywords'
        ],
        '10.20.20.153': [
          'campaign','campaigns','placements','creatives','advertisements'
        ]
      }, privateIpMerge(switchs, {
        v5Databank: [
          '10.20.20.14',
          '10.20.20.146'
        ],
        adServing: [
          '10.20.20.14',
          '10.20.20.153'
        ]
      }));
      done();
    });
    it("key为*", function(done) {
      assert.deepEqual({
        '10.20.20.143': '*'
      }, privateIpMerge(switchs, {
        '*': [
          '10.20.20.143'
        ]
      }));
      done();
    });
  });

  describe('#mkdirp', function() {

    it('target dir exists', function(done) {
      U.mkdirp(__dirname);

      assert.ok(U.fs.existsSync(__dirname));

      done();
    });

    it('parent dir exists', function(done) {
      const dir = __dirname + '/test-mkdirp';
      if (U.fs.existsSync(dir)) U.fs.rmdirSync(dir);

      U.mkdirp(dir);

      assert.ok(U.fs.existsSync(dir));

      U.fs.rmdirSync(dir);

      done();
    });

    it('parent dir non-exists', function(done) {
      const dir = __dirname + '/test-mkdirp-non-exists/test';
      const parent = __dirname + '/test-mkdirp-non-exists';
      if (U.fs.existsSync(dir)) U.fs.rmdirSync(dir);
      if (U.fs.existsSync(parent)) U.fs.rmdirSync(parent);

      U.mkdirp(dir);

      assert.ok(U.fs.existsSync(dir));
      U.fs.rmdirSync(dir);
      U.fs.rmdirSync(parent);

      done();
    });

  });

  describe('#decodeBase64Image', function() {

    it('dataString unset', function(done) {
      assert.equal(undefined, U.decodeBase64Image());
      assert.equal(undefined, U.decodeBase64Image(''));
      assert.equal(undefined, U.decodeBase64Image(undefined));
      assert.equal(undefined, U.decodeBase64Image(null));
      assert.equal(undefined, U.decodeBase64Image(0));

      done();
    });

    it('dataString set, unmatch', function(done) {
      assert.equal(undefined, U.decodeBase64Image('hello world'));

      done();
    });

    it('dataString set, match length is 3', function(done) {
      const ret = U.decodeBase64Image(base64image);
      assert.equal('image/gif', ret.type);
      assert.equal('R0lGODdhBQAFAIACAAAAAP/eACwAAAAABQAFAAACCIwPkWerClIBADs=', ret.data.toString('base64'));

      done();
    });

  });

});
