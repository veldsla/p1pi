
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var p1 = require('./p1data');
var dbi = require('./dbi');
var dev = require('./routes/dev')

var app = express();

 app.set('port', process.env.PORT || 3000);
 app.set('views', __dirname + '/views');
 app.set('view engine', 'jade');

 app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);
app.get('/dev', dev.index);
app.get('/livedatapoint', function(req, res) {
	res.json(p1.getLastMeasurement());
});
app.get('/livehistory', function(req, res) {
	res.json(p1.getMeasurements());
});

app.get('/gashistory', function(req, res) {
	dbi.getLastweekGas(function(err, rows) {
		res.json(rows);
	});
});

app.get('/gasweekdag', function(req, res) {
	dbi.getGasPerDag(function(err, rows) {
		res.json(rows);
	});
});

//dit haal alle livedata op (test voor stockchart)
app.get('/alllivehist', function(req, res) {
	dbi.getAllLiveHistory(function(err, rows) {
		res.json(rows);
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
