// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
'use strict';
var iothub = require('azure-iothub');
var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var express = require('express');
var config = require('./../config');
var eventhub = require('./eventhub');

var registry = new iothub.Registry(config.connectionString, new iothub.Https());
var message = new Message('hello');
message.messageId = 'unique-message-id';
message.ack = 'full';

var app = express();

var jsonstr = '{"' + config.DeviceId + '": 0}';
var obj = JSON.parse(jsonstr);

eventhub.connect(obj);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/sendmessage/:id', function (req, res) {
  console.log('**send message...',req.params.id, req.query.msg);
  var client = Client.fromConnectionString(config.connectionString);
  client.open(function (err) {
    if (err) handleErrorAndExit(res, err);
    client.send(req.params.id, req.query.msg, function (err) {
      if (err) handleErrorAndExit(res, err);
      console.log("sent msg");
      client.close();
      res.status(200).json({status:"ok"})
    });
  });
})

app.get('/messages/:id', function (req, res) {
  console.log('**listing messages...',req.params.id);
  res.send("" + obj[req.params.id]);
})

app.get('/device/:id', function (req, res) {
  console.log('**listing devices...',req.params.id);
  registry.list(function (err, response, deviceList) {
    deviceList.forEach(function (device) {
      if (device.deviceId == req.params.id) {
          res.send(device);
          console.log(device);
      }
    });
  });
})

app.get('/devices', function (req, res) {
  console.log('**listing devices...',req);
  registry.list(function (err, response, deviceList) {
    res.send(deviceList);
    deviceList.forEach(function (device) {
      console.log(device.deviceId);
    });
  });
})
 
app.listen(3000);

function handleErrorAndExit(res, err){
  console.log(err);
  res.status(500).json({status:err})
}
