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
	console.log("=======Download series start=======");
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
		console.log("=======Download series all images complete=======");
		console.timeEnd('downloadSeries');
		serial_callback();
	});
}

var downloadParallel = function(parallel_callback){
	console.time('downloadParallel');
	console.log("=======Download parallel start=======");
	var count = 0;

	var checkAllDownload = function(){
		count++;
		if(count == images.length){
			console.log("=======Download parallel all images complete=======");
			console.timeEnd('downloadParallel');
			parallel_callback();
		}
	}
	var downloadById = function (id){
			download(images[id], "parallel_" + getImageName(images[id]), function() {
				console.log("Download image complte: " + images[id]);
				checkAllDownload();
			});
	}
	for (var i = 0; i < images.length; i++) {
			downloadById(i);
	};
}

async.series([
    function(callback){
        downloadSeries(callback);
    },
    function(callback){
        downloadParallel(callback);
    }
	],
	function(err, results){
	    console.log("All test download run complete");
	}
);
