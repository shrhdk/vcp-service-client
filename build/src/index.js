"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
var assert = require("assert");
var events = require("events");
var superagent = require("superagent");

var scopes = require("./scopes").SCOPES;

var FetchError = exports.FetchError = (function (_Error) {
  function FetchError(message, code) {
    _classCallCheck(this, FetchError);

    this.message = message;
    this.code = code;
  }

  _inherits(FetchError, _Error);

  return FetchError;
})(Error);

var Fetcher = (function (_events$EventEmitter) {
  function Fetcher() {
    _classCallCheck(this, Fetcher);

    if (_events$EventEmitter != null) {
      _events$EventEmitter.apply(this, arguments);
    }
  }

  _inherits(Fetcher, _events$EventEmitter);

  _createClass(Fetcher, {
    fetch: {
      value: function fetch(url, options) {
        var _this = this;

        assert(url, "url required");

        options = options || {};

        var method = options.method || "get";

        var req = superagent[method](url);

        var timeout = options.timeout || 10000;
        req.timeout(timeout);

        // set access_token to Authroization header
        if (options.access_token) {
          req.set("Authorization", "Bearer " + options.access_token);
        }

        // set content-type to form-urlencoded
        if (options.body) {
          if (typeof options.body === "object") {
            req.type(options.type || "form");
          }
          req.send(options.body);
        }

        return new Promise(function (done, fail) {
          _this.on("cancel", function () {
            // req.abort() blocks for returning TimeouError to req.end
            // so make it async and reject promise first
            setTimeout(function () {
              req.abort();
            }, 0);
            fail(new Error("upload canceled"));
          });

          req.end(function (err, res) {
            _this.removeAllListeners("cancel");

            if (err) {
              return fail(err);
            }

            var status = res.status;
            var body = res.body;

            if (status > 399) {
              var message = undefined,
                  code = undefined;

              if (body.error !== undefined) {
                // single error
                message = body.error_description;
                code = body.error;
              } else if (body.errors !== undefined) {
                // multiple error
                // but use only first.
                message = body.errors[0].message;
                code = body.errors[0].message_id;
              } else {
                throw new Error("cant be here: error = " + text);
              }

              var _err = new FetchError(message, code);
              return fail(_err);
            }

            if (res.header["content-length"] === "0") {
              body = null;
            }

            return done(body);
          });
        });
      }
    }
  });

  return Fetcher;
})(events.EventEmitter);

var VCPClient = exports.VCPClient = (function (_Fetcher) {

  /**
   * @constructor
   * @param {String} endpoint - endpoint url string for Auth API
   * @param {Object} params - parameter for Auth API
   * @param {String} params.client_id - client_id of client app
   * @param {String} params.client_secret - client_secret of client app
   * @param {String} params.username - CID of user
   * @param {String} params.password - password of user
   * @param {String[]} params.scope - list of scope string
   * @param {String} params.grant_type - grant_type of API
   */

  function VCPClient(endpoint, params) {
    _classCallCheck(this, VCPClient);

    assert(endpoint, "endpoint required");
    VCPClient.validateParams(params);

    _get(Object.getPrototypeOf(VCPClient.prototype), "constructor", this).call(this);
    this.endpoint = endpoint;
    this.params = params;
  }

  _inherits(VCPClient, _Fetcher);

  _createClass(VCPClient, {
    auth: {
      value: function auth() {
        var _this = this;

        var url = "" + this.endpoint + "/auth/token";
        var params = this.params;

        return this.fetch(url, {
          method: "post",
          body: { // copy params for join scope
            /*eslint camelcase:0*/
            client_id: params.client_id,
            client_secret: params.client_secret,
            username: params.username,
            password: params.password,
            scope: params.scope.join(" "),
            grant_type: params.grant_type
          }
        }).then(function (authInfo) {
          _this.authInfo = authInfo;
          return Promise.resolve();
        });
      }
    },
    discovery: {
      value: function discovery(scope) {
        assert(scope, "scope is required");

        var url = "" + this.endpoint + "/auth/discovery";
        var access_token = this.authInfo.access_token;

        return this.fetch(url, {
          method: "post",
          access_token: access_token,
          body: { scope: scope }
        }).then(function (response) {
          if (response[scope] === undefined) {
            throw new Error("discovery result doesn't include " + scope + " field: " + JSON.stringify(response));
          }
          return response[scope];
        });
      }
    },
    accountInfo: {
      value: function accountInfo() {
        return this.discovery(scopes.GD_ACCOUNT_INFO_QUERY);
      }
    },
    userInfo: {
      value: function userInfo() {
        return this.discovery(scopes.USERINFO_QUERY);
      }
    },
    information: {
      value: function information() {
        return this.discovery(scopes.INFORMATION_URI);
      }
    },
    rosters: {
      value: function rosters() {
        var _this = this;

        return this.discovery(scopes.ROSTER_SERVICE_HTTP_API).then(function (res) {
          var url = "" + res.endpoint + "/" + _this.params.username;
          var access_token = res.access_token;

          return _this.fetch(url, {
            method: "get",
            access_token: access_token
          });
        });
      }
    },
    roster: {
      value: function roster(cid) {
        var _this = this;

        assert(cid, "cid is required");

        return this.discovery(scopes.ROSTER_SERVICE_HTTP_API).then(function (res) {
          var url = "" + res.endpoint + "/" + _this.params.username + "/" + cid;
          var access_token = res.access_token;

          return _this.fetch(url, {
            method: "get",
            access_token: access_token
          });
        });
      }
    },
    addRoster: {
      value: function addRoster(cid) {
        var _this = this;

        var name = arguments[1] === undefined ? cid : arguments[1];
        var name_kana = arguments[2] === undefined ? "" : arguments[2];
        return (function () {
          assert(cid, "cid is required");

          return _this.discovery(scopes.ROSTER_SERVICE_HTTP_API).then(function (res) {
            var url = "" + res.endpoint + "/" + _this.params.username;
            var access_token = res.access_token;
            var body = {
              udc_id: cid,
              name: name,
              name_kana: name_kana
            };

            return _this.fetch(url, {
              method: "post",
              type: "json",
              access_token: access_token,
              body: body
            });
          });
        })();
      }
    },
    logUpload: {

      /**
       * upload log with Log Upload API.
       * `log` will upload and save on log server with `filename`
       *
       * @param {String} log - log data for upload
       * @param {String} filename - filename of uploaded log
       * @param {Number} [timeout=5000ms] - number for uploading timeout in milli second
       * @returns {Promise} resolve when upload finished, reject otherwise
       */

      value: function logUpload(log, filename, timeout) {
        var _this = this;

        assert(log, "log is required");
        assert(filename, "filename is required");

        // API limit for logfile name
        assert(filename.length < 32, "logfile name too large. (API limit less than 32byte )");
        assert(/^[a-zA-Z0-9_\-\.]+$/.test(filename), "invalid log filename. (API limit alpahnumeric and -, ., _)");

        // API limit is limit for logfile size
        assert(log.length < 1024 * 1024 * 128, "logfile too big. (API limit 128MB)");

        // optional and default to 10 sec
        timeout = timeout || 10000;

        return this.discovery(scopes.LOG_UPLOAD_API).then(function (res) {
          var url = res.endpoint;
          url = url.replace("{filename_suffix}", filename);

          return _this.fetch(url, {
            method: "post",
            body: log,
            access_token: res.access_token,
            timeout: timeout
          });
        });
      }
    },
    logUploadCancel: {

      /**
       * canceling log upload
       * and resolve promise of logUpload()
       */

      value: function logUploadCancel() {
        this.emit("cancel");
      }
    }
  }, {
    validateParams: {
      value: function validateParams(params) {
        assert(params, "params required");

        assert(params.client_id, "params.client_id required");
        assert.strictEqual(typeof params.client_id, "string", "params.client_id should be string");

        assert(params.client_secret, "params.client_secret required");
        assert.strictEqual(typeof params.client_secret, "string", "params.client_secret should be string");

        assert(params.username, "params.username required");
        assert.strictEqual(typeof params.username, "string", "params.username should be string");

        assert(params.password, "params.password required");
        assert.strictEqual(typeof params.password, "string", "params.password should be string");

        assert(params.scope, "params.scope required");
        assert(Array.isArray(params.scope), "params.scope should be array");

        assert(params.grant_type, "params.grant_type required");
        assert.strictEqual(typeof params.grant_type, "string", "params.grant_type should be string");
      }
    }
  });

  return VCPClient;
})(Fetcher);