var fs    = require('fs'),
	request = require('request'),
	async   = require('async');

var images = [
	"http://placehold.it/1024x1000.jpg",
	"http://placehold.it/1024x2000.jpg",
	"http://placehold.it/1024x3000.jpg",
	"http://placehold.it/1024x4000.jpg",
	"http://placehold.it/1024x5000.jpg",
	"http://placehold.it/1024x6000.jpg",
	"http://placehold.it/1024x7000.jpg",
	"http://placehold.it/1024x8000.jpg",
	"http://placehold.it/1024x9000.jpg",
	"http://placehold.it/1024x10000.jpg"
];


var download = function(uri, filename, callback) {
	var uri_nocache = uri + "?rand=" + Math.random();
	request.head(uri_nocache, function(err, res, body) {
		request(uri_nocache).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

var getImageName = function(url) {
	var index    = url.lastIndexOf("/") + 1;
	var filename = url.substr(index);
	return filename;
}

var downloadSeries = function(serial_callback){
	console.time('downloadSeries');
	console.log("Download series start");
	async.forEachSeries(images, function(image, callback) {
		download(image, "series_" + getImageName(image), function() {
			console.log("Download image complte: " + image);
			callback();
		});
	}, function(err) {
		if(err){
			console.log("Error:");
			console.log(err);
		}
		console.log("Download series all images complete");
		console.timeEnd('downloadSeries');
		serial_callback();
	});
}

var downloadParallel = function(parallel_callback){
	console.time('downloadParallel');
	console.log("Download parallel start");
	async.parallel([
	    function(callback){
				download(images[0], "parallel_" + getImageName(images[0]), function() {
					console.log("Download image complte: " + images[0]);
					callback();
				});
	    },
	    function(callback){
				download(images[1], "parallel_" + getImageName(images[1]), function() {
					console.log("Download image complte: " + images[1]);
					callback();
				});
	    },
	    function(callback){
				download(images[2], "parallel_" + getImageName(images[2]), function() {
					console.log("Download image complte: " + images[2]);
					callback();
				});
	    },
	    function(callback){
				download(images[3], "parallel_" + getImageName(images[3]), function() {
					console.log("Download image complte: " + images[3]);
					callback();
				});
	    },
	    function(callback){
				download(images[4], "parallel_" + getImageName(images[4]), function() {
					console.log("Download image complte: " + images[4]);
					callback();
				});
	    },
	    function(callback){
				download(images[5], "parallel_" + getImageName(images[5]), function() {
					console.log("Download image complte: " + images[5]);
					callback();
				});
	    },
	    function(callback){
				download(images[6], "parallel_" + getImageName(images[6]), function() {
					console.log("Download image complte: " + images[6]);
					callback();
				});
	    },
	    function(callback){
				download(images[7], "parallel_" + getImageName(images[7]), function() {
					console.log("Download image complte: " + images[7]);
					callback();
				});
	    },
	    function(callback){
				download(images[8], "parallel_" + getImageName(images[8]), function() {
					console.log("Download image complte: " + images[8]);
					callback();
				});
	    },
	    function(callback){
				download(images[9], "parallel_" + getImageName(images[9]), function() {
					console.log("Download image complte: " + images[9]);
					callback();
				});
	    }

	],
	// optional callback
	function(err, results){
		if(err){
			console.log("Error:");
			console.log(err);
		}
		console.log("Download parallel all images complete");
		console.timeEnd('downloadParallel');
		parallel_callback();
	});
}


async.series([
    function(callback){
        downloadSeries(callback);
    },
    function(callback){
        downloadParallel(callback);
    }
],
// optional callback
function(err, results){
    console.log("All test download run complete");
});
