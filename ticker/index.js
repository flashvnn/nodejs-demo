var Ticker = require("./ticker.js");

var tick = new Ticker();
tick.on("tick", function(count){
	console.log("ticker count:" + count);
	if(count == 5){
		this.stop();
	}
});

tick.start();
