var EventEmitter = require('events').EventEmitter;
var util = require('util');
// create the class
var Ticker = function(){
	this.timerid = false;
	this.count = 0;
};
Ticker.prototype = new EventEmitter();

Ticker.prototype.tick = function() {
	var self = this;
	self.count++;
	self.emit("tick", self.count);
}

Ticker.prototype.start = function() {
	var self = this;
	self.timerid = setInterval(function(){
		self.tick();
	}, 1000);
}

Ticker.prototype.stop = function() {
	var self = this;
	if(self.timerid){
		clearInterval(self.timerid);
	}
}

module.exports = Ticker;
