// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
var device = require('azure-iot-device');
var config = require('./../config');

var client = new device.Client.fromConnectionString(config.deviceConnectionString);

// Create a message and send it to the IoT hub every second
setInterval(function () {
  var windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
  var data = JSON.stringify({
    deviceId: 'mydevice',
    windSpeed: windSpeed
  });
  var message = new device.Message(data);
  message.properties.add('myproperty', 'myvalue');
  console.log("Sending message: " + message.getData());
  client.sendEvent(message, function(err,res) {
        //console.log(err);
    });

}, 1000);

// Monitor messages from IoT Hub and print them in the console.
setInterval(function () {
  client.receive(function (err, msg, res) {
    if (err) printResultFor('receive')(err, res);
    else if (res.statusCode !== 204) {
      console.log('Received data: ' + msg.getData());
      client.complete(msg, printResultFor('complete'));
    }
  });
}, 1000);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res && (res.statusCode !== 204)) console.log(op + ' status: ' + res.statusCode + ' ' + res.statusMessage);
  };
}
