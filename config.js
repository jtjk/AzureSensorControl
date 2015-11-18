
var config = {
    host: 'http://localhost:3000',
    connectionString: 'HostName=myiothub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=mysaskey',
    deviceConnectionString: 'HostName=myiothub.azure-devices.net;DeviceId=mydevice;SharedAccessKey=mysaskey',
    serviceBusHost: 'myiothub-eventhub-compatible-endpoint hostname',
    eventHubName: 'myiothub-eventhub-compatiblename',
    partitions: 2,
    SASKeyName: 'iothubowner',
    SASKey: 'mysaskey'
};


module.exports = config;
