// Dependencies
var Lien = require("lien")
  , Tinyreq = require("tinyreq")
  , Ul = require("ul")
  ;

/*!
 * Wrabbit
 * Creates a new `Wrabbit` instance.
 *
 * @name Wrabbit
 * @function
 */
function Wrabbit() {}

/**
 * req
 * Creates a request to the provided url.
 *
 * @name req
 * @function
 * @param {String} url The script url.
 * @param {Function} callback The callback function.
 * @return {Request} The request object.
 */
Wrabbit.prototype.req = function (url, callback) {
    if (!url) { return callback("Missing the file to wrap", 400); }
    return Tinyreq(url, function (err, content, res) {
        if (err) { return callback(err, 500); }
        if (res.statusCode === 404) { return callback("The provided url ends with 404.", 404); }
        if (res.statusCode !== 200) { return callback("Cannot access the provided file.", 400); }
        callback(null, content);
    });
};

/**
 * wrap
 * Wrap content with the wrapping code.
 *
 * @name wrap
 * @function
 * @param {String} content The content to wrap.
 * @param {String} wrapline The wrapping line (which will be prepended to the content).
 * @return {String} The wrapped content.
 */
Wrabbit.prototype.wrap = function (content, wrapline) {
    if (!wrapline || !wrapline.trim()) { return content; }
    return wrapline + "\n" + content + "\nreturn module;});";
};

/**
 * wrapUrl
 * Wraps the content of a script by providing its url.
 *
 * @name wrapUrl
 * @function
 * @param {String} url The script url.
 * @param {String} wrapline The wrapping line (which will be prepended to the content).
 * @param {Function} callback The callback function.
 */
Wrabbit.prototype.wrapUrl = function (url, wrapline, callback) {
    var self = this;
    self.req(url, function (err, content) {
        if (err) { return callback(err, content); }
        callback(null, self.wrap(content, wrapline));
    });
};

/**
 * server
 * Starts the `Wrabbit` server.
 *
 * @name server
 * @function
 * @param {Object|Number} options The `Lien` server options or the server port.
 * @param {Function} callback The callback function called after the server is started.
 */
Wrabbit.prototype.server = function (options, callback) {

    var self = this;

    if (typeof options === "number") {
        options = {
            port: options
          , host: null
        };
    }

    options = Ul.merge(options, {
        host: "localhost"
      , root: __dirname + "/public"
    });

    var server = new Lien(options);

    server.page.add(/^\/api\/https?\/.*/, function (lien) {
        var url = lien.req.url.match(/^\/api\/(https?)\/(.*)$/);
        if (url && url.length === 3) {
            url = url[1] + "://" + url[2];
        }
        self.wrapUrl(url, lien.search.w === "1" ? "E('http://" + lien.req.headers["host"] + lien.req.url + "', function (require, module, exports, global, engine) {" : "", function (err, res) {
            if (err) { return lien.end(err, res); }
            lien.end(res, 200, "js", {
                "Access-Control-Allow-Origin": "*"
            });
        });
    });

    server.page.add("/", "html/index.html");
    server.on("load", callback);
};

module.exports = new Wrabbit();
