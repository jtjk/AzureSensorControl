'use strict';
var Promise = require('bluebird'),
    AMQPClient  = require('amqp10').Client,
    Policy = require('amqp10').Policy,
    translator = require('amqp10').translator;
var config = require('./../config.js');
var express = require('express');



// Set the offset for the EventHub - this is where it should start receiving from, and is typically different for each partition
// Here, I'm setting a global offset, just to show you how it's done. See node-sbus-amqp10 for a wrapper library that will
// take care of this for you.
var filterOffset; // example filter offset value might be: 43350;

var settingsFile = process.argv[2];
var settings = {};
if (settingsFile) {
  settings = require('./' + settingsFile);
} else {
  settings = {
    serviceBusHost: config.serviceBusHost,
    eventHubName: config.eventHubName,
    partitions: config.partitions,
    SASKeyName: config.SASKeyName,
    SASKey: config.SASKey
  };
}

if (!settings.serviceBusHost || !settings.eventHubName || !settings.SASKeyName || !settings.SASKey || !settings.partitions) {
  console.warn('Must provide either settings json file or appropriate environment variables.');
  process.exit(1);
}

var protocol = settings.protocol || 'amqps';
var serviceBusHost = settings.serviceBusHost + '.servicebus.windows.net';
if (settings.serviceBusHost.indexOf(".") !== -1) {
  serviceBusHost = settings.serviceBusHost;
}
var sasName = settings.SASKeyName;
var sasKey = settings.SASKey;
var eventHubName = settings.eventHubName;
var numPartitions = settings.partitions;

var uri = protocol + '://' + encodeURIComponent(sasName) + ':' + encodeURIComponent(sasKey) + '@' + serviceBusHost;
var sendAddr = eventHubName;
var recvAddr = eventHubName + '/ConsumerGroups/$default/Partitions/';

var msgVal = Math.floor(Math.random() * 1000000);

var client = new AMQPClient(Policy.EventHub);
var errorHandler = function(myIdx, rx_err) { console.warn('==> RX ERROR: ', rx_err); };
var messageHandler = function (myIdx, msg) {
  console.log('received(' + myIdx + '): ', msg.body);
  filterOffset = msg.annotations.value["x-opt-offset"];
  console.log(filterOffset);
 //this.send(msg.body);
  //if (msg.annotations) console.log('annotations: ', msg.annotations);
  //if (msg.body.DataValue === msgVal) {
  //  client.disconnect().then(function () {
  //    console.log('disconnected, when we saw the value we inserted.');
  //    process.exit(0);
  //  });
  //}
};

function range(begin, end) {
  return Array.apply(null, new Array(end - begin)).map(function(_, i) { return i + begin; });
}

var createPartitionReceiver = function(curIdx, curRcvAddr, filterOption,res) {
  return client.createReceiver(curRcvAddr, filterOption)
    .then(function (receiver) {
      //res.send("for me");
      receiver.on('message', messageHandler.bind(res, curIdx));
      receiver.on('errorReceived', errorHandler.bind(null, curIdx));
    });
};

function connect(res, offset) {
  var filterOption; // todo:: need a x-opt-offset per partition.
  if (filterOffset) {
    filterOption = {
      attach: { source: { filter: {
        'apache.org:selector-filter:string': translator(
          ['described', ['symbol', 'apache.org:selector-filter:string'], ['string', "amqp.annotation.x-opt-offset > '" + offset + "'"]])
      } } }
    };
  }

//  res.send("wait");
  client.connect(uri)
    .then(function () {
      return Promise.all([
        Promise.map(range(0, numPartitions), function(idx) {
          return createPartitionReceiver(idx, recvAddr + idx, filterOption,res);
        })
      ]);
    })
    .error(function (e) {
      console.warn('connection error: ', e);
    });
}
function getOffset() {
  return filterOffset;
}
module.exports.connect = connect;
module.exports.getOffset = getOffset;
