var http = require('http');
var https = require('https');
var url = require('url');
var express  = require('express');
var app      = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var PORT = 9100;

app.use(express.static(__dirname));
app.use(bodyParser.json());


app.get('/', function(req, res) {
    res.sendfile('dist/index.html');
});

function getOptions(req) {
    var path = req.url,
        discoverServer = "http://localhost:12345",
        parsedUrl = url.parse(discoverServer, true, true),
        host = parsedUrl.hostname,
        method = req.method,
        port =parsedUrl.port;
        body = req.body;

    if(path.toLowerCase().indexOf('nodeconfig')>-1) {
        port = '12343';
    }
    console.log('-- body:'+JSON.stringify(body));
    var post_data = JSON.stringify(body);
    var options = {
        hostname: host,
        port: port,
        method: method,
        path: path,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
    };

    console.log('-options:'+JSON.stringify(options));
    return options;
}

function makeRequest(options, serverRes, req) {
   // http.request(options, callback.bind(this, serverRes)).end();
    var fwd_req = http.request(options, callback.bind(this, serverRes));

    if(req.body) {
        var post_data = JSON.stringify(req.body); // post the data
        fwd_req.write(post_data);
    }

    fwd_req.on('error', function (e) {
        // General error, i.e.
        //  - ECONNRESET - server closed the socket unexpectedly
        //  - ECONNREFUSED - server did not listen
        //  - HPE_INVALID_VERSION
        //  - HPE_INVALID_STATUS
        //  - ... (other HPE_* codes) - server returned garbage
        console.log(e);
    });

    fwd_req.on('timeout', function () {
        // Timeout happend. Server received request, but not handled it
        // (i.e. doesn't send any response or it took to long).
        // You don't know what happend.
        // It will emit 'error' message as well (with ECONNRESET code).
        console.log('timeout');
        fwd_req.abort();
    });

    fwd_req.setTimeout(5000);
    fwd_req.end();
}

function callback(serverRes, response) {
    var str = '';

    response.setEncoding('utf8');
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        //console.log(str);
        var resObj = serverRes;
        try {
            //console.log('--write header for:'+ resObj.url);
            resObj.writeHead(serverRes.statusCode, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin":"*" });
            resObj.end(str);

        } catch (e) {
            resObj.end();
        }
    });
}

app.all("/api/*", function(req, res) {
    var options = getOptions(req);
    makeRequest(options, res, req);
});
console.log('Diamanti Discover server listening on port '+PORT);

app.listen(PORT).on('error', function(err) {
    if (err.errno === 'EADDRINUSE') {
        console.log('Port is already in use.');
    } else {
        console.log(err);
    }
});


