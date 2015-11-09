var AWS = require("aws-sdk");
//var url = require('url');

AWS.config.loadFromPath('./config.json');

var task =  function(request, callback){
	params = request.query;
	console.log(request.query);
	AWS.config.loadFromPath('./config.json');
	var s3 = new AWS.S3();
	s3.getObject(
	{bucket: params.bucket, key: params.key},
	function(error, data) {
		if (error)
		{
			callback(error);
			return;
		}
		var digest = require('helpers');
		var checksum = digest.calculateDigest('sha-1', data);
		callback(null, checksum);
	});
		
	callback("error");
	//var url_parts = url.parse(request.url, true);
	
	
	
}

exports.action = task