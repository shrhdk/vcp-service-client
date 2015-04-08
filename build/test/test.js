'use strict';
var assert = require('power-assert');
var VCPClient = require('../src').VCPClient;
var FetchError = require('../src').FetchError;
var config = require('../config/config').config;
var scopes = require('../src/scopes').SCOPES;
var endpoint = config.ENDPOINT;
describe('VCPClient test', function () {
    this.timeout(10 * 1000);
    var params = {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        username: config.CID,
        password: config.PASSWORD,
        scope: config.SCOPE_LIST,
        grant_type: 'password'
    };
    describe('constructor', function () {
        it('new', function () {
            var client = new VCPClient(endpoint, params);
            assert.deepEqual(assert._expr(assert._capt(assert._capt(client, 'arguments/0/object').params, 'arguments/0'), {
                content: 'assert.deepEqual(client.params, params)',
                filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                line: 28
            }), assert._expr(assert._capt(params, 'arguments/1'), {
                content: 'assert.deepEqual(client.params, params)',
                filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                line: 28
            }));
            assert.strictEqual(assert._expr(assert._capt(assert._capt(client, 'arguments/0/object').endpoint, 'arguments/0'), {
                content: 'assert.strictEqual(client.endpoint, endpoint)',
                filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                line: 29
            }), assert._expr(assert._capt(endpoint, 'arguments/1'), {
                content: 'assert.strictEqual(client.endpoint, endpoint)',
                filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                line: 29
            }));
        });
        it('new without endpoint', function () {
            try {
                var client = new VCPClient();
                assert.fail('cant be here: ' + client);
            } catch (err) {
                assert(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(err instanceof Error)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 37
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').message, 'arguments/0'), {
                    content: 'assert.strictEqual(err.message, "endpoint required")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 38
                }), 'endpoint required');
            }
        });
        it('new without params', function () {
            try {
                var client = new VCPClient(endpoint);
                assert.fail('cant be here: ' + client);
            } catch (err) {
                assert(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert(err instanceof Error)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 47
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').message, 'arguments/0'), {
                    content: 'assert.strictEqual(err.message, "params required")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 48
                }), 'params required');
            }
        });
        describe('new with invalid params', function () {
            var copy = function (o) {
                return JSON.parse(JSON.stringify(o));
            };
            [
                {
                    name: 'without params.client_id',
                    params: function () {
                        var p = copy(params);
                        delete p.client_id;
                        return p;
                    },
                    message: 'params.client_id required'
                },
                {
                    name: 'with empty params.client_id',
                    params: function () {
                        var p = copy(params);
                        p.client_id = '';
                        return p;
                    },
                    message: 'params.client_id required'
                },
                {
                    name: 'with invalid type params.client_id',
                    params: function () {
                        var p = copy(params);
                        p.client_id = 1000;
                        return p;
                    },
                    message: 'params.client_id should be string'
                },
                {
                    name: 'without params.client_secret',
                    params: function () {
                        var p = copy(params);
                        delete p.client_secret;
                        return p;
                    },
                    message: 'params.client_secret required'
                },
                {
                    name: 'with empty params.client_secret',
                    params: function () {
                        var p = copy(params);
                        p.client_secret = '';
                        return p;
                    },
                    message: 'params.client_secret required'
                },
                {
                    name: 'with invalid params.client_secret',
                    params: function () {
                        var p = copy(params);
                        p.client_secret = 1000;
                        return p;
                    },
                    message: 'params.client_secret should be string'
                },
                {
                    name: 'without params.username',
                    params: function () {
                        var p = copy(params);
                        delete p.username;
                        return p;
                    },
                    message: 'params.username required'
                },
                {
                    name: 'with empty params.username',
                    params: function () {
                        var p = copy(params);
                        p.username = '';
                        return p;
                    },
                    message: 'params.username required'
                },
                {
                    name: 'with invalid params.username',
                    params: function () {
                        var p = copy(params);
                        p.username = 1000;
                        return p;
                    },
                    message: 'params.username should be string'
                },
                {
                    name: 'without params.password',
                    params: function () {
                        var p = copy(params);
                        delete p.password;
                        return p;
                    },
                    message: 'params.password required'
                },
                {
                    name: 'with empty params.password',
                    params: function () {
                        var p = copy(params);
                        p.password = '';
                        return p;
                    },
                    message: 'params.password required'
                },
                {
                    name: 'with invalid params.password',
                    params: function () {
                        var p = copy(params);
                        p.password = 1000;
                        return p;
                    },
                    message: 'params.password should be string'
                },
                {
                    name: 'without params.scope',
                    params: function () {
                        var p = copy(params);
                        delete p.scope;
                        return p;
                    },
                    message: 'params.scope required'
                },
                {
                    name: 'with invalid params.scope',
                    params: function () {
                        var p = copy(params);
                        p.scope = 1000;
                        return p;
                    },
                    message: 'params.scope should be array'
                },
                {
                    name: 'without params.grant_type',
                    params: function () {
                        var p = copy(params);
                        delete p.grant_type;
                        return p;
                    },
                    message: 'params.grant_type required'
                },
                {
                    name: 'with empty params.grant_type',
                    params: function () {
                        var p = copy(params);
                        p.grant_type = '';
                        return p;
                    },
                    message: 'params.grant_type required'
                },
                {
                    name: 'with invalid params.grant_type',
                    params: function () {
                        var p = copy(params);
                        p.grant_type = 1000;
                        return p;
                    },
                    message: 'params.grant_type should be string'
                }
            ].forEach(function (p) {
                it(p.name, function () {
                    try {
                        var client = new VCPClient(endpoint, p.params());
                        assert.fail('cant be here: ' + client);
                    } catch (err) {
                        assert(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(assert._capt(assert, 'arguments/0/right/object').AssertionError, 'arguments/0/right'), 'arguments/0'), {
                            content: 'assert(err instanceof assert.AssertionError)',
                            filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                            line: 212
                        }));
                        assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').message, 'arguments/0'), {
                            content: 'assert.strictEqual(err.message, p.message)',
                            filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                            line: 213
                        }), assert._expr(assert._capt(assert._capt(p, 'arguments/1/object').message, 'arguments/1'), {
                            content: 'assert.strictEqual(err.message, p.message)',
                            filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                            line: 213
                        }));
                    }
                });
            });
        });
    });
    describe('emitter', function () {
        it('emit', function () {
            var client = new VCPClient(endpoint, params);
            var c = 0;
            client.on('test', function test0(data) {
                assert.strictEqual(assert._expr(assert._capt(data, 'arguments/0'), {
                    content: 'assert.strictEqual(data, "data")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 226
                }), 'data');
                if (c++ === 2) {
                    done();
                }
            });
            client.on('test', function test1(data) {
                assert.strictEqual(assert._expr(assert._capt(data, 'arguments/0'), {
                    content: 'assert.strictEqual(data, "data")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 233
                }), 'data');
                if (c++ === 2) {
                    done();
                }
            });
            client.emit('test', 'data');
        });
    });
    describe('auth', function () {
        it('success', function (done) {
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                assert.ok(assert._expr(assert._capt(assert._capt(assert._capt(client, 'arguments/0/object/object').authInfo, 'arguments/0/object').access_token, 'arguments/0'), {
                    content: 'assert.ok(client.authInfo.access_token)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 247
                }));
                assert.ok(assert._expr(assert._capt(assert._capt(assert._capt(client, 'arguments/0/object/object').authInfo, 'arguments/0/object').refresh_token, 'arguments/0'), {
                    content: 'assert.ok(client.authInfo.refresh_token)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 248
                }));
                assert.ok(assert._expr(assert._capt(assert._capt(assert._capt(client, 'arguments/0/object/object').authInfo, 'arguments/0/object').token_type, 'arguments/0'), {
                    content: 'assert.ok(client.authInfo.token_type)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 249
                }));
                assert.ok(assert._expr(assert._capt(assert._capt(assert._capt(client, 'arguments/0/object/object').authInfo, 'arguments/0/object').expires_in, 'arguments/0'), {
                    content: 'assert.ok(client.authInfo.expires_in)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 250
                }));
                assert.ok(assert._expr(assert._capt(assert._capt(assert._capt(client, 'arguments/0/object/object').authInfo, 'arguments/0/object').scope, 'arguments/0'), {
                    content: 'assert.ok(client.authInfo.scope)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 251
                }));
                done();
            })['catch'](done);
        });
        it('error: param with invalid client_id', function (done) {
            var p = JSON.parse(JSON.stringify(params));
            p.client_id = 'xxxxxxxx';
            var client = new VCPClient(endpoint, p);
            client.auth().then(function () {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(FetchError, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof FetchError)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 263
                }));
                assert.ok(assert._expr(assert._capt(/The client identifier provided is invalid.*/.test(assert._capt(assert._capt(err, 'arguments/0/arguments/0/object').message, 'arguments/0/arguments/0')), 'arguments/0'), {
                    content: 'assert.ok(/The client identifier provided is invalid.*/.test(err.message))',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 264
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').code, 'arguments/0'), {
                    content: 'assert.strictEqual(err.code, "invalid_client")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 265
                }), 'invalid_client');
                done();
            })['catch'](done);
        });
        it('error: param with invalid client_secret', function (done) {
            var p = JSON.parse(JSON.stringify(params));
            p.client_secret = 'xxxxxxxx';
            var client = new VCPClient(endpoint, p);
            client.auth().then(function () {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(FetchError, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof FetchError)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 277
                }));
                assert.ok(assert._expr(assert._capt(/The client identifier provided is invalid.*/.test(assert._capt(assert._capt(err, 'arguments/0/arguments/0/object').message, 'arguments/0/arguments/0')), 'arguments/0'), {
                    content: 'assert.ok(/The client identifier provided is invalid.*/.test(err.message))',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 278
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').code, 'arguments/0'), {
                    content: 'assert.strictEqual(err.code, "invalid_client")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 279
                }), 'invalid_client');
                done();
            })['catch'](done);
        });
        it('error: param with invalid username', function (done) {
            var p = JSON.parse(JSON.stringify(params));
            p.username = 'xxxxxxxx';
            var client = new VCPClient(endpoint, p);
            client.auth().then(function () {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(FetchError, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof FetchError)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 291
                }));
                assert.ok(assert._expr(assert._capt(/The provided access grant is invalid, expired, or revoked.*/.test(assert._capt(assert._capt(err, 'arguments/0/arguments/0/object').message, 'arguments/0/arguments/0')), 'arguments/0'), {
                    content: 'assert.ok(/The provided access grant is invalid, expired, or revoked.*/.test(err.message))',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 292
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').code, 'arguments/0'), {
                    content: 'assert.strictEqual(err.code, "invalid_grant")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 293
                }), 'invalid_grant');
                done();
            })['catch'](done);
        });
        it('error: param with invalid password', function (done) {
            var p = JSON.parse(JSON.stringify(params));
            p.password = 'xxxxxxxx';
            var client = new VCPClient(endpoint, p);
            client.auth().then(function () {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(FetchError, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof FetchError)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 305
                }));
                assert.ok(assert._expr(assert._capt(/The provided access grant is invalid, expired, or revoked.*/.test(assert._capt(assert._capt(err, 'arguments/0/arguments/0/object').message, 'arguments/0/arguments/0')), 'arguments/0'), {
                    content: 'assert.ok(/The provided access grant is invalid, expired, or revoked.*/.test(err.message))',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 306
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').code, 'arguments/0'), {
                    content: 'assert.strictEqual(err.code, "invalid_grant")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 307
                }), 'invalid_grant');
                done();
            })['catch'](done);
        });
        it('error: param with invalid scope', function (done) {
            var p = JSON.parse(JSON.stringify(params));
            p.scope = [];
            var client = new VCPClient(endpoint, p);
            client.auth().then(function () {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(FetchError, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof FetchError)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 319
                }));
                assert.ok(assert._expr(assert._capt(/The request is missing a required parameter.*/.test(assert._capt(assert._capt(err, 'arguments/0/arguments/0/object').message, 'arguments/0/arguments/0')), 'arguments/0'), {
                    content: 'assert.ok(/The request is missing a required parameter.*/.test(err.message))',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 320
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').code, 'arguments/0'), {
                    content: 'assert.strictEqual(err.code, "invalid_request")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 321
                }), 'invalid_request');
                done();
            })['catch'](done);
        });
        it('error: param with invalid grant_type', function (done) {
            var p = JSON.parse(JSON.stringify(params));
            p.grant_type = 'xxxxxxxx';
            var client = new VCPClient(endpoint, p);
            client.auth().then(function () {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(FetchError, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof FetchError)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 333
                }));
                assert.ok(assert._expr(assert._capt(/The access grant included - its type or another attribute - is not supported by the authorization server..*/.test(assert._capt(assert._capt(err, 'arguments/0/arguments/0/object').message, 'arguments/0/arguments/0')), 'arguments/0'), {
                    content: 'assert.ok(/The access grant included - its type or another attribute - is not supported by the authorization server..*/.test(err.message))',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 334
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').code, 'arguments/0'), {
                    content: 'assert.strictEqual(err.code, "unsupported_grant_type")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 335
                }), 'unsupported_grant_type');
                done();
            })['catch'](done);
        });
    });
    describe('discovery', function () {
        it('success', function (done) {
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                return client.discovery(scopes.INFORMATION_URI);
            }).then(function (info) {
                assert(assert._expr(assert._capt(info, 'arguments/0'), {
                    content: 'assert(info)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 348
                }));
                done();
            })['catch'](done);
        });
        it('error: no result for SCOPE', function (done) {
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                return client.discovery(scopes.AUTH_API);
            }).then(function (info) {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof Error)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 360
                }));
                assert.ok(assert._expr(assert._capt(/discovery result doesn\'t include.*/.test(assert._capt(assert._capt(err, 'arguments/0/arguments/0/object').message, 'arguments/0/arguments/0')), 'arguments/0'), {
                    content: 'assert.ok(/discovery result doesn\\\'t include.*/.test(err.message))',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 361
                }));
                done();
            });
        });
    });
    describe('accountInfo', function () {
        it('success', function (done) {
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                return client.accountInfo();
            }).then(function (info) {
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(info, 'arguments/0/argument/object').email_verified, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof info.email_verified, "boolean")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 373
                }), 'boolean');
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(info, 'arguments/0/argument/object').web_password_changed, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof info.web_password_changed, "boolean")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 374
                }), 'boolean');
                done();
            })['catch'](done);
        });
    });
    describe('userInfo', function () {
        it('success', function (done) {
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                return client.userInfo();
            }).then(function (info) {
                assert.strictEqual(assert._expr(assert._capt(assert._capt(info, 'arguments/0/object').type, 'arguments/0'), {
                    content: 'assert.strictEqual(info.type, "account")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 386
                }), 'account');
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(info, 'arguments/0/argument/object').id, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof info.id, "number")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 387
                }), 'number');
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(info, 'arguments/0/argument/object').display_name, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof info.display_name, "string")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 388
                }), 'string');
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(info, 'arguments/0/argument/object').email, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof info.email, "string")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 389
                }), 'string');
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(info, 'arguments/0/argument/object').link, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof info.link, "string")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 390
                }), 'string');
                assert.strictEqual(assert._expr(assert._capt(assert._capt(info, 'arguments/0/object').udc_id, 'arguments/0'), {
                    content: 'assert.strictEqual(info.udc_id, params.username)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 391
                }), assert._expr(assert._capt(assert._capt(params, 'arguments/1/object').username, 'arguments/1'), {
                    content: 'assert.strictEqual(info.udc_id, params.username)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 391
                }));
                done();
            })['catch'](done);
        });
    });
    describe('information', function (done) {
        it('success', function (done) {
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                return client.information();
            }).then(function (info) {
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(info, 'arguments/0/argument/object').ja, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof info.ja, "string")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 403
                }), 'string');
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(info, 'arguments/0/argument/object').global, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof info.global, "string")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 404
                }), 'string');
                done();
            })['catch'](done);
        });
    });
    describe('rosters', function (done) {
        it('success', function (done) {
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                return client.rosters();
            }).then(function (rosters) {
                assert.ok(assert._expr(assert._capt(assert._capt(Array, 'arguments/0/callee/object').isArray(assert._capt(assert._capt(rosters, 'arguments/0/arguments/0/object').results, 'arguments/0/arguments/0')), 'arguments/0'), {
                    content: 'assert.ok(Array.isArray(rosters.results))',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 416
                }));
                assert.strictEqual(assert._expr(assert._capt(typeof assert._capt(assert._capt(rosters, 'arguments/0/argument/object').total_results, 'arguments/0/argument'), 'arguments/0'), {
                    content: 'assert.strictEqual(typeof rosters.total_results, "number")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 417
                }), 'number');
                assert.strictEqual(assert._expr(assert._capt(assert._capt(rosters, 'arguments/0/object').total_results, 'arguments/0'), {
                    content: 'assert.strictEqual(rosters.total_results, rosters.results.length)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 418
                }), assert._expr(assert._capt(assert._capt(assert._capt(rosters, 'arguments/1/object/object').results, 'arguments/1/object').length, 'arguments/1'), {
                    content: 'assert.strictEqual(rosters.total_results, rosters.results.length)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 418
                }));
                done();
            })['catch'](done);
        });
    });
    describe('roster', function (done) {
        it('success', function (done) {
            var cid = undefined;
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                return client.rosters();
            }).then(function (rosters) {
                if (rosters.results.length > 0) {
                    cid = rosters.results.shift().udc_id;
                } else {
                    return done(new Error('' + params.username + ' doesn\'t have a roster'));
                }
                return client.roster(cid);
            }).then(function (roster) {
                assert.ok(assert._expr(assert._capt(roster, 'arguments/0'), {
                    content: 'assert.ok(roster)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 438
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(roster, 'arguments/0/object').udc_id, 'arguments/0'), {
                    content: 'assert.strictEqual(roster.udc_id, cid)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 439
                }), assert._expr(assert._capt(cid, 'arguments/1'), {
                    content: 'assert.strictEqual(roster.udc_id, cid)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 439
                }));
                done();
            })['catch'](done);
        });
        it('error: non-existent cid', function (done) {
            var cid = undefined;
            var client = new VCPClient(endpoint, params);
            client.auth().then(function () {
                return client.roster('invalidCID');
            }).then(function (roster) {
                assert.ok(assert._expr(assert._capt(roster, 'arguments/0'), {
                    content: 'assert.ok(roster)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 450
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(roster, 'arguments/0/object').udc_id, 'arguments/0'), {
                    content: 'assert.strictEqual(roster.udc_id, cid)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 451
                }), assert._expr(assert._capt(cid, 'arguments/1'), {
                    content: 'assert.strictEqual(roster.udc_id, cid)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 451
                }));
                done();
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(FetchError, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof FetchError)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 454
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').message, 'arguments/0'), {
                    content: 'assert.strictEqual(err.message, "\u5B58\u5728\u3057\u306A\u3044UDC-ID\u3067\u3059")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 455
                }), '\u5B58\u5728\u3057\u306A\u3044UDC-ID\u3067\u3059');
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').code, 'arguments/0'), {
                    content: 'assert.strictEqual(err.code, "roster.error.udcid.notexist")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 456
                }), 'roster.error.udcid.notexist');
                done();
            })['catch'](done);
        });
    });
    describe('logUpload', function (done) {
        it('success', function (done) {
            var client = new VCPClient(endpoint, params);
            var filename = 'log_upload_test_from_browser';
            var log = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
            client.auth().then(function () {
                return client.logUpload(log, filename);
            }).then(function (result) {
                assert.strictEqual(assert._expr(assert._capt(result, 'arguments/0'), {
                    content: 'assert.strictEqual(result, null)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 471
                }), null);
                done();
            })['catch'](done);
        });
        it('cancel', function (done) {
            var client = new VCPClient(endpoint, params);
            var filename = 'log_upload_test_from_browser';
            var log = 'a';
            for (var i = 0; i < 20; i++) {
                log += log;
            }
            client.auth().then(function () {
                setTimeout(function () {
                    client.logUploadCancel();
                }, 50);
                return client.logUpload(log, filename);
            }).then(function (result) {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof Error)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 494
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').message, 'arguments/0'), {
                    content: 'assert.strictEqual(err.message, "upload canceled")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 495
                }), 'upload canceled');
                done();
            })['catch'](done);
        });
        it('error: timeout', function (done) {
            var client = new VCPClient(endpoint, params);
            var filename = 'log_upload_test_from_browser';
            var log = 'a';
            for (var i = 0; i < 20; i++) {
                log += log;
            }
            var timeout = 1;
            client.auth().then(function () {
                return client.logUpload(log, filename, timeout);
            }).then(function (result) {
                assert.fail('cant be here');
            })['catch'](function (err) {
                assert.ok(assert._expr(assert._capt(assert._capt(err, 'arguments/0/left') instanceof assert._capt(Error, 'arguments/0/right'), 'arguments/0'), {
                    content: 'assert.ok(err instanceof Error)',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 515
                }));
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').message, 'arguments/0'), {
                    content: 'assert.strictEqual(err.message, "timeout of " + timeout + "ms exceeded")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 516
                }), assert._expr(assert._capt(assert._capt('timeout of ' + assert._capt(timeout, 'arguments/1/left/right'), 'arguments/1/left') + 'ms exceeded', 'arguments/1'), {
                    content: 'assert.strictEqual(err.message, "timeout of " + timeout + "ms exceeded")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 516
                }));
                done();
            })['catch'](done);
        });
        it('error: file size too large', function () {
            var client = new VCPClient(endpoint, params);
            var filename = 'log_upload_test_from_browser';
            var log = 'a';
            for (var i = 0; i < 27; i++) {
                log += log;
            }
            try {
                client.logUpload(log, filename);
            } catch (err) {
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').message, 'arguments/0'), {
                    content: 'assert.strictEqual(err.message, "logfile too big. (API limit 128MB)")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 532
                }), 'logfile too big. (API limit 128MB)');
            }
        });
        it('error: invalid file name', function () {
            var client = new VCPClient(endpoint, params);
            var filename = 'test#from%browser';
            var log = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
            try {
                client.logUpload(log, filename);
            } catch (err) {
                assert.strictEqual(assert._expr(assert._capt(assert._capt(err, 'arguments/0/object').message, 'arguments/0'), {
                    content: 'assert.strictEqual(err.message, "invalid log filename. (API limit alpahnumeric and -, ., _)")',
                    filepath: '/Users/hideki/Develop/vcp-service-client/test/test.js',
                    line: 544
                }), 'invalid log filename. (API limit alpahnumeric and -, ., _)');
            }
        });
    });
});