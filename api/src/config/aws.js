import config from './index'
const AWS = require('aws-sdk');


//AWS Object
AWS.config =  new AWS.Config({ accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: 'us-west-2' });

//DynamoDBObject
const dynamoClient = new AWS.DynamoDB({endpoint:config.aws.endpoint});                            

const tables = {
    "transactions" : "transactions",
    "dashboard":"dashboard",
    "persons":"persons",
    "tranctionTypes":"tranctionTypes"
}
const tableSchemas = 
    {
    "transactionsSchema": {
        TableName: tables["transactions"],
        KeySchema: [
            {
                AttributeName: "Id",
                KeyType: "HASH", //Partition key
            },
            {
                AttributeName: "date",
                KeyType: "RANGE" //Sort key
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: "Id",
                AttributeType: "N"
            },
            {
                AttributeName: "date",
                AttributeType: "S"
            }

        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }

    },
    "tranctionTypes":{
        TableName: tables["tranctionTypes"],
        KeySchema: [
            {
                AttributeName: "Id",
                KeyType: "HASH", //Partition key
            },
            {
                AttributeName: "value",
                KeyType: "RANGE" //Sort key
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: "Id",
                AttributeType: "N"
            },
            {
                AttributeName: "value",
                AttributeType: "S"
            }

        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }

    }
};




export default class AWSResource {  
    constructor()  {
        
    }
          
    
    createDynamoSchema() {
        return new Promise((resolve, reject) => {                        
            let dynamoClient = new AWS.DynamoDB({endpoint:config.aws.endpoint});
            let params = {
                TableName: transactions
            };                        
            dynamoClient.describeTable(params, function (err, data) {
                if (err) { 
                    console.log(err);
                    dynamoClient.createTable(dynamoScehma, function (err, data) {                        
                        if (err) {                            
                            console.log(err);
                            reject(err);
                        }
                        else {
                            console.log('workingggg');
                            resolve(data);
                        }
                    });
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}

