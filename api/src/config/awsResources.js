import config from '.'
const AWS = require('aws-sdk');

//AWS Object
AWS.config =  new AWS.Config({ accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: 'us-west-2' });

//DynamoDBObject
const dynamo = new AWS.DynamoDB({endpoint:config.aws.endpoint});
const dynamoClient = new AWS.DynamoDB.DocumentClient({endpoint:config.aws.endpoint});                            

export {AWS,dynamoClient,dynamo};

