import config from './index'
import aws from 'aws-sdk';

export default class AWSResource{
    constructor(){
        aws.config.update({region:config.aws.region});
    }
    dynamoClient = new aws.DynamoDB({endpoint:config.aws.endpoint});
    
    createDynamoSchema(){
        
    }
    dynamoTables = {
        transactions:"transactions"
    }
    dynamoScehma = {
         transactions : {
            TableName : dynamoTables.transactions,
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
                    AttributeName: "amount", 
                    AttributeType: "N" 
                }
            ],
            ProvisionedThroughput: {       
                ReadCapacityUnits: 1, 
                WriteCapacityUnits: 1
            }
        }
    };

}

