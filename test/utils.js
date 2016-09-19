var assert  = require('assert')
  , U       = require('../build/app/lib/utils').default;

describe('Utils', function() {

  var privateIpMerge = U.privateIpMerge;

  describe('#privateIpMerge', function() {
    var switchs = {
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
});
