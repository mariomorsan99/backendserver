var express = require('express');
var app = express();
var path = require('path');
var pathToJson = path.resolve(__dirname, '../config.json');
var AWS = require('aws-sdk');
var uuid = require('uuid');

var Memcached = require('memcached');
var memcached = new Memcached();

/* code to connect with your memecahced server */
memcached.connect('redisweb.we3lv4.0001.use2.cache.amazonaws.com:11211', function(err, conn) {
    if (err) {
        console.log(conn.server, 'error while memcached connection!!');
    }
});


AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});


//Rutas
app.post('/', (request, resp, next) => {


    AWS.config.loadFromPath(pathToJson);

    var elasticache = new AWS.ElastiCache({ apiVersion: '2015-02-02' });


    var user = {
        'userId': 'iuytredcvb12345sdfgh',
        'userName': 'testUser',
        'emailId': 'demo.jsonworld@gmail.com',
        'phone': 8287374553,
        'availableFor': '2 hours',
        'createdOn': 1543122402
    }


    // saving information to user key.
    memcached.set('user', user, 10000, function(err) {
        if (err) throw new err;
    });


    // method to get saved data....
    memcached.get('user', function(err, data) {
        console.log(data);
        resp.status(200).json({
            mensaje: 'peticion correcta',
            ok: true,
            data: data
        });
    });


});

module.exports = app;