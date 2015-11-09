var AWS = require("aws-sdk");
//var url = require('url');

AWS.config.loadFromPath('./config.json');

var task =  function(request, callback){
	params = request.query;
	console.log(request.query);
	AWS.config.loadFromPath('./config.json');
	var s3 = new AWS.S3();
	s3.getObject(
	{Bucket: params.bucket, Key: params.key},
	function(error, data) {
		if (error)
		{
			callback(error);
			return;
		}
		console.log(data)
		var digest = require('../helpers');
		var checksum = digest.calculateDigest('sha1', data);
		callback(null, checksum);
		return;
	});
		
	callback("error");
	//var url_parts = url.parse(request.url, true);
	
	
	
}

exports.action = task