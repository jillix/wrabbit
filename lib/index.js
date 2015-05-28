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
    callback = callback || function () {};
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
 * @return {Request} The request object.
 */
Wrabbit.prototype.wrapUrl = function (url, wrapline, callback) {
    var self = this;
    return self.req(url, function (err, content) {
        if (err) { return callback(err, content); }
        callback(null, self.wrap(content, wrapline));
    });
};

/**
 * stream
 * Pipes data from the provided url to a stream.
 *
 * @name stream
 * @function
 * @param {String} url The script url.
 * @param {String} wrapline The wrapping line (which will be prepended to the content).
 * @param {String} stream The output stream.
 */
Wrabbit.prototype.stream = function (url, wrapline, stream) {
    var self = this;

    if (typeof wrapline !== "string") {
        stream = wraline;
        wrapline = null;
    }

    if (wrapline) {
        stream.write(wrapline);
    }

    var req = self.req(url);
    req.on("data", function (chunk) {
        stream.write(chunk);
    }).on("error", function (err) {
        if (typeof stream.writeHead === "function") {
            stream.writeHead(400);
        }
        stream.end(err);
    }).on("end", function () {
        if (wrapline) {
            stream.write("\nreturn module;});");
        }
        if (typeof stream.writeHead === "function") {
            stream.writeHead(200, {
                "Content-type": "text/javascript"
            });
        }
        stream.end();
    });

    return req;
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
        self.stream(url, lien.search.w === "1" ? "E('http://" + lien.req.headers.host + lien.req.url + "', function (require, module, exports, global, engine) {" : "", lien.res);
    });

    server.page.add("/", "html/index.html");
    server.on("load", callback);
};

module.exports = new Wrabbit();
