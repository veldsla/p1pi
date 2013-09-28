sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/db.sqlite3');

exports.insertMessage = function(time, message) {
	db.run("INSERT INTO messages VALUES (?, ?)", [time.getTime(), message]);
};

exports.insertGas = function(time, value) {
	db.run("INSERT INTO gas VALUES (?, ?, ?, ?, ?, ?, ?)", [time.getTime(), time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getDay(), time.getHours(), value]);
};

exports.insertElec = function(time, values) {
	db.run("INSERT INTO elec VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [time.getTime(), time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getDay(), time.getHours(), values.uselaag, values.usehoog, values.prodlaag, values.prodhoog]);
};

exports.getLastweekGas = function(cb) {
	var now = new Date().getTime();
	db.all("SELECT jstime, stand from gas where jstime >= ?", now - (7*24*60*60*1000), cb);
};

exports.insertElecLive = function(time, verbruik, productie) {
	db.run("INSERT INTO livedata values(?, ?, ?)", [time.getTime(), verbruik, productie]);
};

exports.getAllLiveHistory = function(cb) {
	db.all("SELECT * from livedata", cb);
};
