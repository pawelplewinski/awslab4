var AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json');

var task =  function(request, callback){
	callback(null, JSON.stringify(request.query));
	
	var s3= new AWS.S3();
	var params={
		Bucket: request.query.bucket,
		Key: request.query.key
	};
	
	s3.getObject(params, function(err,data){
		if (err) console.log(err);
		else console.log(data);
	});
	
}

exports.action = task