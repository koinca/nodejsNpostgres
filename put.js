// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

function PostCode(codestring) {
  // Build the post string from an object
  var dummydata = {
  "items": [
    {
      "uuid": "e4453391-a385-42ea-933e-5677a227bec6",
      "spec": {
        "staticIP": {
          "cidr": "172.16.6.232/19",
          "defaultGW": "172.16.0.1",
          "dnsServers": [
            "172.16.1.2",
            "75.75.75.75",
            "75.75.76.76"
          ],
          "dnsDomainName": "eng.datawisesystems.com"
        },
        "hostname": "intlserv2"
      }
    },
    {
      "uuid": "e27c3a83-b41c-4578-9bdc-cd85fe531b8a",
      "spec": {
        "staticIP": {
          "cidr": "172.16.6.231/19",
          "defaultGW": "172.16.0.1",
          "dnsServers": [
            "172.16.1.2",
            "75.75.75.75",
            "75.75.76.76"
          ],
          "dnsDomainName": "eng.datawisesystems.com"
        },
        "hostname": "intlserv1"
      }
    },
    {
      "uuid": "e615bda0-8ec2-43a9-82cf-2dc093dd2ab8",
      "spec": {
        "staticIP": {
          "cidr": "172.16.6.233/19",
          "defaultGW": "172.16.0.1",
          "dnsServers": [
            "172.16.1.2",
            "75.75.75.75",
            "75.75.76.76"
          ],
          "dnsDomainName": "eng.datawisesystems.com"
        },
        "hostname": "intlserv3"
      }
    }
  ]
};


var clusterData = {
  "name": "test",
  "spec": {
    "nodes": [
      "intlserv1",
      "intlserv2",
      "intlserv3"
    ],
    "config": {
      "virtualIP": "172.16.6.237",
      "storageVlan": 401
    }
  }
};

  var post_data = JSON.stringify(clusterData);
  console.log(post_data);

  // An object of options to indicate where to post to
//http://172.16.6.231:12343/api/v1beta1/nodeconfig
  var post_options2 = {
      host: '172.16.6.231',
      port: '12343',
      path: '/api/v1beta1/nodeconfig',
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

 var post_options2 = {
      host: '172.16.6.231',
      port: '12343',
      path: '/api/v1beta1/nodeconfig',
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

 var post_options = {
      host: '172.16.6.231',
      port: '12345',
      path: '/api/v1beta1/cluster',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

debugger;
  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      debugger;
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });
debugger;
  // post the data
  post_req.write(post_data);
  post_req.end();

}

PostCode('abc');
