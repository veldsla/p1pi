var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var dbi = require("./dbi");

var lastmeasurement;
var lastprodmeasurement;
var measurements = new Array();
var pos=0;
var lastgastime=0;
var lastelectime=0;

//actueel verbruik elec
var currentUsageRE = /^1-0:1.7.0\((\d+\.\d+)\*kW\)/m;
var currentProdRE  = /^1-0:2.7.0\((\d+\.\d+)\*kW\)/m;
//gas metingen
//  0-1:24.3.0(121220200000)(00)(60)(1)(0-1:24.2.1)(m3)
//  (00256.100)
var gasRE = /^0-1:24.3.0\((\d{12})\).*\(m3\)[\s\S]+\((\d{5}\.\d{3})\)/m

//de elec standen:
//1-0:1.8.1(00201.441*kWh) gebruik laag
//1-0:1.8.2(00159.309*kWh) gebruik hoog
//1-0:2.8.1(00000.000*kWh) prod laag
//1-0:2.8.2(00000.000*kWh) prod hoog
var elecRE = {
	uselaag: /^1-0:1.8.1\((\d{5}\.\d{3})\*kWh\)/m,
	usehoog: /^1-0:1.8.2\((\d{5}\.\d{3})\*kWh\)/m,
	prodlaag: /^1-0:2.8.1\((\d{5}\.\d{3})\*kWh\)/m,
	prodhoog: /^1-0:2.8.2\((\d{5}\.\d{3})\*kWh\)/m,
};




var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 9600,
  dataBits: 7,
  parity: 'even',
  stopBits: 1,
  parser: serialport.parsers.readline("!")
});

port.on('data', function(data) {
  //all DB inserts will use this time (for consistency)
  var time = new Date()
  var timeval = time.getTime();

  //storge msg in db
  //dbi.insertMessage(time, data);

  //look for this line: 1-0:1.7.0(0000.52*kW)
  var match = currentUsageRE.exec(data);
  if(match != null && match.length > 0) {
	console.log("huidig elecverbruik "+match[1]);
        lastmeasurement = [timeval, Math.round(parseFloat(match[1])*1000)];
	if(measurements.length >= 1000) measurements.shift();
	measurements.push(lastmeasurement);
  }

  var match = currentProdRE.exec(data);
  if(match != null && match.length > 0) {
        lastprodmeasurement = [timeval, Math.round(parseFloat(match[1])*1000)];
  }

	//insert live data in db
	dbi.insertElecLive(time, lastmeasurement[1], lastprodmeasurement[1]);


	//de elect standen!
	var estand = {usehoog:0, uselaag:0, prodhoog: 0, prodlaag: 0};

	//update every 5 minutes
	if( (timeval - lastelectime) > 300000) {
		for(var m in estand) {
			var match = elecRE[m].exec(data);
  			if(match != null && match.length > 0) {
				estand[m] = Math.round(parseFloat(match[1])*1000);
			}
		}
		console.log(estand);
		//insert in db
		dbi.insertElec(time, estand);
		lastelectime = timeval;
	}



  var gmatch = gasRE.exec(data);
  if(gmatch != null && gmatch.length > 0) {
	console.log("huidig gasstand "+gmatch[2]+ " van "+gmatch[1]);
	newgastime = gmatch[1];
	gasm3 = Math.round(parseFloat(gmatch[2])*1000); //gas in liters geen float issues
	if(newgastime != lastgastime) {
		//store in db
		dbi.insertGas(time, gasm3);
		lastgastime = newgastime;
	}
  }
  //console.log("data="+data);
});

exports.getLastMeasurement = function() {
	return lastmeasurement;
};

exports.getMeasurements = function() {
	return measurements;
};

port.on('error', function(err) {
  console.log(err);
});

