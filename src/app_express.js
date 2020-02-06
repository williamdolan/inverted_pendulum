const express = require('express')
const mqtt = require('mqtt')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors({origin: '*'}));
const request = require('request');

var ip = require ("./inverted-pendulum");

var p = new ip.InvertedPendulum();

//var myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);
var port = process.argv[2] || 8080;

console.log('port: ', port)

app.get('/', function (req, res) {
  res.send('hello world')
});

app.post('/', function (req, res) {
});

app.post('/config', function (req, res) {
    var config = req.body;
    console.log(config);
    console.log(config.position);
    p.config(config);
    res.send("ok");
});

app.post('/start', function (req, res) {
    p.start();
    res.send("ok");
});

app.post('/stop', function (req, res) {
    p.stop();
});

app.post('/reset', function (req, res) {
    //p.reset();
});

app.get('/position', function(req, res) {
    console.log("GET position received");
    var obj = {'theta': p.getAngle(),
               'position': p.getPlatformPosition()};
    res.send(obj);
});

app.get('/state', function(req, res) {
    var obj = {'state': p.getState()};
    res.send(obj);
});

app.listen(port);

var mqtt_client  = mqtt.connect('tcp://mqtt:1883');
mqtt_client.on('connect', function () {
  mqtt_client.subscribe('command', {qos: 1}, function (err) {
    if (!err) {
      console.log("Connected to broker");
      mqtt_client.publish('status', 'Hello', {qos:1})
    }
  })
})

mqtt_client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic.toString(), " >> ", message.toString())
  if (topic.toString() == "command")
  {
    if (message.toString() == "STOP")
    {
      console.log("Got STOP");
      p.stop();
    }
    if (message.toString() == "START")
    {
      console.log("Got START");
      p.start();
    }
  }
})

var checkNeighbour = function(err, response, body)
{
  //if (err)
  //{
  //  console.log(err);
  //}
  if (body)
  {
    console.log(body.position);
    if (p.checkNeighbour(body.position))
    {
      mqtt_client.publish('command', 'STOP', {qos: 1});
    }
  }
}


var getNeighbours = function()
{
  console.log("getNeighbours")
  if (p.getState() == "RUNNING")
  {
    var neighbours = p.getNeighbours();
    if (neighbours.A)
    {
      console.log("Getting http://localhost:" + neighbours.A + "/position");
      request('http://localhost:' + neighbours.A + '/position', { json: true }, checkNeighbour);
    }
    if (neighbours.B)
    {
      console.log("Getting http://localhost:" + neighbours.B + "/position");
      request('http://localhost:' + neighbours.B + '/position', { json: true }, checkNeighbour);
    }
  }
}

setInterval(getNeighbours, 500);
