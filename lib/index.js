var Lien = require("lien")
  , Tinyreq = require("tinyreq")
  , Ul = require("ul")
  ;

function Wrabbit() {
}

Wrabbit.prototype.req = function (url, callback) {
    if (url) { return callback("Missing the file to wrap", 400); }
    return Tinyreq(url, function (err, content, res) {
        if (err) { return callback(err, 500); }
        if (res.statusCode === 404) { return callback("The provided url ends with 404.", 404); }
        if (res.statusCode !== 200) { return callback("Cannot access the provided file.", 400); }
        callback(null, content);
    });
};

Wrabbit.prototype.wrap = function (content) {
};

Wrabbit.prototype.wrapUrl = function (url, callback) {

};

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

    server.page.add("/api", function (lien) {
        self.wrapUrl(lien.search.url, lien.req.protocol + "://" + lien.req.get("host") + lien.req.originalUrl, function (err, res) {
            if (err) { return link.end(err, res); }
            link.end(res);
        });
    });

    server.page.add("/", "html/index.html");
    server.on("load", callback);
};

module.exports = new Wrabbit();
