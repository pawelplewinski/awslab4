var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";

var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');

var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new S3Form(policy);
	//4. get bucket name
	var bucket = policy.getConditionValueByKey("bucket")
	
	var form = s3Form.generateS3FormFields();
	
	var credentials = s3Form.addS3CredientalsFields(form, awsConfig)

	var simpledb = new AWS.SimpleDB();
	
	var date = new Date().toString();
	
	var domain = 'aandrzejewski'
	
	
	var dbParams = {
		Attributes: [
		{
			Name: "Type",
			Value: "generateForm"
		},
		{
			Name: "Date",
			Value: date
		},
		{
			Name: "Browser",
			Value: request.headers.host
		},
		{
			Name: "User-Agent",
			Value: request.headers['user-agent']
		}
		],
		DomainName: domain,
		ItemName: "logItem"
	};
	
	var createDomain = function(){
		simpledb.createDomain({DomainName:domain}, function(err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     console.log("Domain created!");           // successful response
		});
	}; 
	
	simpledb.domainMetadata({DomainName:domain}, function(err, data) {
	  if (err)  createDomain();// an error occurred
	  else     console.log("Domain exists");           // successful response
	});
	
	simpledb.putAttributes(dbParams, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log("Data logged");           // successful response
	});
	
	callback(null, {template: INDEX_TEMPLATE, params:{fields:form, bucket:bucket}});
}

exports.action = task;
