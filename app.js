var app = require('http').createServer()
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(1234);

//event namespaces
var evt = io
    .of('/event')
    .on('connection', function (socket) {
        console.log('event connected:' + socket.id);

        var reason = ['failed', 'something failed', 'something else'];


        /* example msg. to be replaced with something from the server */
        var objSend={
            "metadata": {
              "name": "testpod-0783.13f6184b14426dc0",
              "namespace": "default",
              "selfLink": "/api/v1beta3/namespaces/default/events/testpod-0783.13f6184b14426dc0",
              "uid": "ddf2b42e-37a9-11e5-a23a-fe73ae3be7388",
              "resourceVersion": "12299990",
              "creationTimestamp": "2015-07-31T17:30:41Z",
              "deletionTimestamp": "2015-07-31T18:30:41Z"
            },
            "involvedObject": {
              "kind": "Pod",
              "namespace": "default",
              "name": "testpod-0783",
              "uid": "f2f204e7-323f-11e5-b834-300ed5c7f632",
              "apiVersion": "v1beta1",
              "resourceVersion": "11059844",
              "fieldPath": "implicitly required container POD"
            },
            "reason": "created",
            "message": "Created with docker id 4eff73eb751ddda112a6fbff04ae7e0c78c8905b41db0fd232be93f7645eccb1",
            "source": {
              "component": "kubelet",
              "host": "172.16.4.212"
            },
            "severity": "2",
            "firstTimestamp": "2015-07-31T17:30:41Z",
            "lastTimestamp": new Date(),
            "count": 1
        };

        /* remove the interval, it's only for demo purposes */
        var timer = setInterval(function(){
            console.log( 'sending event to client');
            objSend.lastTimestamp = new Date();
            objSend.reason = reason[Math.floor(Math.random()*100) % 3];
            objSend.involvedObject.name = 'testpod-099'+Math.floor(Math.random()*100) % 10;
            socket.emit('event', objSend);
        }, 5000);



        socket.on('get', function (type) {
            console.log('request from client in event ');
            genPod();
        });

        socket.on('disconnect', function () {
            console.log('got disconnected in event');
            clearInterval(timer);
        });
});

//pod and pod just namespaces
var pod = io
    .of('/pod')
    .on('connection', function (socket) {
        console.log('pod connected:'+socket.id)
        var timer = null;
        //pullling from client
        function genPod() {
            timer = setInterval(function () {
                var obj = {
                    time: new Date().getTime(),
                    data : Math.floor((Math.random() * 10) + 1)
                };
                console.log('sending to client pod:'+obj.data);
                socket.volatile.emit('set', obj);
            }, 3000);
        }

        socket.on('get', function (type) {
            console.log('request from client in pod ');
            genPod();
        });

        socket.on('disconnect', function () {
            console.log('got disconnected in pod');
            clearInterval(timer);
        });
});

var node = io
  .of('/node')
  .on('connection', function (socket) {
     console.log('node connected:'+socket.id)
        var timer = null;
        //pullling from client
        function genNode() {
            timer = setInterval(function () {
                var obj = {
                    time: new Date().getTime(),
                    data : Math.floor((Math.random() * 10) + 1)
                };
                console.log('sending to client from node:'+obj.data);
                socket.volatile.emit('set', obj);
            }, 3000);
        }

        socket.on('get', function (type) {
            console.log('request from client in node');
            genNode();
        });

        socket.on('disconnect', function () {
            console.log('got disconnected in node');
            clearInterval(timer);
        });

});




