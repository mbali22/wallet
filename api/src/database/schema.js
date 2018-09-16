import { dynamoClient } from "../config/awsResources";
import async from 'async';

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
                {AttributeName: "personId", KeyType: "HASH"}            
            ],
            AttributeDefinitions: [
                { AttributeName: "personId",AttributeType: "N"}            
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
            {AttributeName: "PersonId", AttributeType: "N"},
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
            {AttributeName: "id", KeyType: "HASH"}  
        ],
        AttributeDefinitions: [
            { AttributeName: "id",AttributeType: "N"}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,WriteCapacityUnits: 10
        }
    },
    "persons":{
        TableName: tables["persons"],
        KeySchema: [
            {AttributeName: "belongsTo", KeyType: "HASH"},
            {AttributeName: "id",KeyType: "RANGE"}

        ],
        AttributeDefinitions: [
            { AttributeName: "belongsTo",AttributeType: "N"},
            { AttributeName: "id",AttributeType: "N"}            
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,WriteCapacityUnits: 10
        }
    },
    
};

function createDBScehma() {
    return new Promise((resolve, reject) => {
        let promises= []; let tableResults = [];
        //resolve(Object.keys(tables));                    
        Object.keys(tables).forEach((table) => {
            promises.push(
                createDynamoDBTable(table).then(data => {
                    tableResults.push(data);
                }).catch(err => {
                    tableResults.push(err);
                })
            );
        });
        Promise.all(promises).then((tableResults) => {
            resolve(tableResults);
        }).catch(error => {
            reject(error);
        });
    });
}


function createDynamoDBTable(table) {
    return new Promise((resolve, reject) => {
        try {
            dynamoClient.createTable(tableSchemas[table], function (err, data) {
                if (err)
                    reject({[table] :err});
                else
                    resolve({[table] :data});
            });
        }
        catch (error) {
            reject({[table] :error});
        }
    });
}
export {createDBScehma,tables};



// var tranctionTypes = {
//     TableName: 'tranctionTypes',
// };
// dynamodb.deleteTable(tranctionTypes, function(err, data) {
//     if (err) ppJson(err); // an error occurred
//     else ppJson(data); // successful response
// });

// var dashboard = {
//     TableName: 'dashboard',
// };
// dynamodb.deleteTable(dashboard, function(err, data) {
//     if (err) ppJson(err); // an error occurred
//     else ppJson(data); // successful response
// });

// var transactions = {
//     TableName: 'transactions',
// };
// dynamodb.deleteTable(transactions, function(err, data) {
//     if (err) ppJson(err); // an error occurred
//     else ppJson(data); // successful response
// });

// var persons = {
//     TableName: 'persons',
// };
// dynamodb.deleteTable(persons, function(err, data) {
//     if (err) ppJson(err); // an error occurred
//     else ppJson(data); // successful response
// });