'use strict';

var extend = require('deep-extend');
var _ = require('lodash');
var request = require('request');
var VERSION = require('../package.json').version;
var fs = require("fs");
var url = require("url")

function Citi(options) {
    if (!(this instanceof Citi)) {
        return new Citi(options);
    }

    this.isAuthenticated = false;
    this.map = JSON.parse(fs.readFileSync(__dirname + "/map.json", "utf8"));
    this.options = extend(this.map.options, options);
    this.request = request.defaults(this.options.request);
}

(function() {

    this.getBasicAuthentication = function() {
        return 'Basic ' + (new Buffer(this.options.clientId + ':' + this.options.appSecret)).toString("base64");
    }

    this.authenticate = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            if (self.isAuthenticated) {
                return resolve(true);
            }
            var options = self.getOptions("authenticate");
            options.headers['Authorization'] = self.getBasicAuthentication();

            self.handleRequest(options, function(error, response, data) {
                if (!data.access_token) {
                    throw new Error(data.details)
                }
                self.isAuthenticated = true;
                self.options.request.headers['Authorization'] = 'Bearer ' + data.access_token
                self.options.request.headers['client_id'] = self.options.clientId
                resolve(true)
            });
        });
    }

    this.handleRequest = function(options, callback) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.request(options, callback || function(error, response, data) {
                if (error) {
                    reject(error)
                }
                resolve(data)
            })
        });
    }

    // this.getProducts = function() {
    //   this.authenticate().then(function(){
    //     var options = this.getOptions("get-products");
    //     this.handleRequest(options);
    //   });
    // }

    this.getProduct = function(product) {
        var self = this;
        var productReturn = null;
        return new Promise(function(resolve, reject) {
            self.authenticate().then(function() {
                var options = self.getOptions("get-product");
                self.handleRequest(options).then(function(products) {
                    productReturn = _.find(products['products'], function(e) {
                        return e.productCode == product.productCode
                    });
                    if (productReturn) {
                        resolve(productReturn);
                    } else {
                        reject("no product found");
                    }
                });
            });
        });
    }

    this.createUnsecuredCreditApplication = function(applicationRequest) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.authenticate().then(function() {
                var options = self.getOptions("create-unsecured-credit-application");
                options.body = applicationRequest
                self.handleRequest(options).then(function(acknowledge){
                    resolve(acknowledge);
                })
            });
        });
    }

    this.getOptions = function(service) {
        var host = this.options.host;
        var path = this.map.services[service].path;
        var method = this.map.services[service].method;
        var form = this.map.services[service].form;
        var headers = this.options.request.headers;
        var options = {
            port: 443,
            host: host,
            protocol: "https:",
            pathname: path,
            method: method,
            form: form,
            headers: headers,
            json: true
        }
        options.uri = url.format(options);
        return options;
    }

}).call(Citi.prototype);

module.exports = Citi
