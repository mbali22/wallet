import config from './index'
var AWS = require('aws-sdk');

const transactions = "transactions";
const dynamoClient = new AWS.DynamoDB({endpoint:config.aws.endpoint});                            
const dynamoScehma = {    
       TableName : "transactions",
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
           ReadCapacityUnits: 1, 
           WriteCapacityUnits: 1
       }
   
};


export default class AWSResource {  
    constructor()  {
        AWS.config =  new AWS.Config({ accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: 'us-west-2' });
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

