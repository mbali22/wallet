import { dynamoClient } from "../config/awsResources";

const tables = {
    "dashboard":"dashboard",
    "transactions" : "transactions",
    "persons":"persons",
    "tranctionTypes":"tranctionTypes"
}
const tableSchemas = 
    {
    "dashboard":{
            TableName: tables["dashboard"],
            KeySchema: [
                {AttributeName: "dashBoardId", KeyType: "HASH"}            
            ],
            AttributeDefinitions: [
                { AttributeName: "Id",AttributeType: "N"}            
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,WriteCapacityUnits: 10
            }
        },
    "transactions": {
        TableName: tables["transactions"],
        KeySchema: [
            { AttributeName: "PersonId", KeyType: "HASH"}, //Partition key 
            {AttributeName: "date",KeyType: "RANGE"}
        ],
        AttributeDefinitions: [
            {AttributeName: "Id", AttributeType: "N"},
            {AttributeName: "date",AttributeType: "S"}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,WriteCapacityUnits: 10
        }
    },
    //master Tables
    "tranctionTypes":{
        TableName: tables["tranctionTypes"],
        KeySchema: [
            {AttributeName: "Id", KeyType: "HASH"},
            {AttributeName: "value",KeyType: "RANGE"} //Sort key            
        ],
        AttributeDefinitions: [
            { AttributeName: "Id",AttributeType: "N"},
            { AttributeName: "value",AttributeType: "S"}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,WriteCapacityUnits: 10
        }
    },
    "persons":{
        TableName: tables["persons"],
        KeySchema: [
            {AttributeName: "id", KeyType: "HASH"}            
        ],
        AttributeDefinitions: [
            { AttributeName: "Id",AttributeType: "N"}            
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,WriteCapacityUnits: 10
        }
    },
    
};

function CreateDBScehma(){
    return new Promise((resolve,reject) => {               
         Object.keys(tables).forEach(table => {               
               resolve(null);
         });
    });
}

export {CreateDBScehma};