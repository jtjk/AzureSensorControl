// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
'use strict';
var iothub = require('azure-iothub');
var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
var express = require('express');
var config = require('./../config');
var EventHubClient = require('./lib/eventhubclient.js');
var WebSocketServer = require('ws').Server
, wss = new WebSocketServer({port: 8080});

var registry = new iothub.Registry(config.connectionString, new iothub.Https());
var message = new Message('hello');
message.messageId = 'unique-message-id';
message.ack = 'full';

var ws_connections = [];

// Create eventhub receiver and send all events to websocket by adding some extra json with that event hub message
var startTime = Date.now();
var ehClient = new EventHubClient(config.connectionString, 'messages/events/');
ehClient.GetPartitionIds().then(function(partitionIds) {
    partitionIds.forEach(function(partitionId) {
	ehClient.CreateReceiver('$Default', partitionId).then(function(receiver) {
	    receiver.StartReceive(startTime).then(function() {
		receiver.on('error', function(error) {
		    serviceError(error.description);
		});
		receiver.on('eventReceived', function(eventData) {
		    if (eventData.SystemProperties['x-opt-enqueued-time'] >= startTime) {
			console.log('Event received: ');
			var ws;
			for (var x = 0;  x<ws_connections.length;x++) {
			    ws = ws_connections[x];
			    ws.send('{"response": "windSpeed", "body":' + JSON.stringify(eventData.Bytes)+'}');
			}
		    }
		});
	    });
	    return receiver;
	});
    });
    return partitionIds;
});

// listen for websocket connections and handle incoming messages
wss.on('connection', function(ws) {
    ws_connections.push(ws);
    ws.on('message', function(message) {
	console.log(message);
	var json = JSON.parse(message);
	
	if (json.method == "devices") {
	    console.log("get devices");
	    registry.list(function (err, response, deviceList) {
		ws.send('{"response": "deviceList", "body":' + JSON.stringify(deviceList)+'}');
		deviceList.forEach(function (device) {
		    console.log(device.deviceId);
		});
	    });
	}
	
	if (json.method == "device") {
	    console.log("get device");
	    registry.list(function (err, response, deviceList) {
		deviceList.forEach(function (device) {
		    if (device.deviceId == json.deviceId) {
			console.log(device.deviceId);
			ws.send('{"response": "device", "body":' + JSON.stringify(device)+'}');
		    }
		});
	    });
	}
	
	if (json.method == "sendmessage") {
	    console.log("send message");
	    var client = Client.fromConnectionString(config.connectionString);
	    client.open(function (err) {
		if (err) handleError(res, err);
		client.send(json.deviceId, json.message, function (err) {
		    if (err) handleError(res, err);
		    console.log("sent msg");
		    client.close();
		});
	    });
	}
	
    });
    
    ws.on('close', function() {
	var index = ws_connections.indexOf(ws);
	if (index > -1) {
	    ws_connections.splice(index,1);
	}
    });
});


function handleError(res, err){
    console.log(err);
}
