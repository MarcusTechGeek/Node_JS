'use strict';

var assert = require('assert');
var nock = require('nock');
var Citi = require('../lib/citi');
var VERSION = require('../package.json').version;

describe('Citi', function() {
  describe('Constructor', function() {
    var defaults = {};
    before(function() {
      defaults = {
        protocol: "https",
        host: "sandbox.apihub.citi.com",
        appSecret: null,
        clientId: null
      };
    });

    it('create new instance', function() {
      var client = new Citi();
      assert(client instanceof Citi);
    });

    it('has default options', function() {
      var client = new Citi();
      assert.deepEqual(
        Object.keys(defaults),
        Object.keys(client.options)
      );
    });

    it('accepts and overrides options', function() {
      var options = {
        appSecret: 'abc123',
        extraOption: 'foo',
        requestOptions: {
          headers: {
            'Accept': 'application/json'
          }
        }
      };

      var client = new Citi(options);

      assert(client.options.hasOwnProperty('extraOption'));
      assert.equal(client.options.extraOption, options.extraOption);

      assert.equal(client.options.appSecret, options.appSecret);

      assert.equal(
        client.options.requestOptions.headers.Accept,
        options.requestOptions.headers.Accept);
    });
  });

  describe('Onboarding', function(){
    describe('retrieve-products', function(){

      it('methods are in place', function(){
        var client = new Citi();
        assert.equal("function", typeof client.getProducts);
        assert.equal("function", typeof client.getProduct);
      })
    })
  })
});
