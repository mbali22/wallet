import { dynamo } from "../config/awsResources";
import async from 'async';

const tables = {
    "dashboard":"dashboard",
    "transactions" : "transactions",
    "persons":"persons",
    "transactionTypes":"transactionTypes",    
}
const tableSchemas = 
    {
    "dashboard":{
            TableName: tables["dashboard"], 
            KeySchema: [
                {AttributeName: "userid", KeyType: "HASH"},
                {AttributeName: "personid", KeyType: "RANGE"}

            ],
            AttributeDefinitions: [
                { AttributeName: "userid",AttributeType: "S"},
                { AttributeName: "personid",AttributeType: "S"}                
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,WriteCapacityUnits: 10
            }
        },
    "transactions": {
        TableName: tables["transactions"],
        KeySchema: [
            {AttributeName: "id", KeyType: "HASH"}            
        ],
        AttributeDefinitions: [
            //{AttributeName: "id", AttributeType: "S"},
            // {AttributeName: "userid", AttributeType: "S"},
            {AttributeName: "id", AttributeType: "S"},
            {AttributeName: "date", AttributeType: "S"},
            {AttributeName: "personid", AttributeType: "S"}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,WriteCapacityUnits: 10
        },
        GlobalSecondaryIndexes: [{
            IndexName: "IdxPersonTransactions",
            KeySchema: [
                { AttributeName: "personid", KeyType: "HASH"},
                { AttributeName: "date",KeyType: "RANGE"}
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }]       
    },
    //master Tables
    "transactionTypes":{
        TableName: tables["transactionTypes"],
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
            {AttributeName: "userid", KeyType: "HASH"},
            {AttributeName: "id",KeyType: "RANGE"}
        ],
        AttributeDefinitions: [
            { AttributeName: "userid",AttributeType: "S"},
            { AttributeName: "id",AttributeType: "S"}            
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,WriteCapacityUnits: 10
        }
    }
    
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
        Promise.all(promises).then(() => {
            resolve(tableResults);
        }).catch(error => {
            reject(tableResults);
        });
    });
}

function deleteDBSchema(){
    return new Promise((resolve,reject) => {
        let promises= []; let tableResults = [];
        //resolve(Object.keys(tables));                    
        Object.keys(tables).forEach((table) => {            
            promises.push(
                deletSchema(table).then(data => {
                    tableResults.push(data);
                }).catch(err => {
                    tableResults.push(err);
                })
            );
        });
        Promise.all(promises).then(() => {
            resolve(tableResults);
        }).catch(error => {
            reject(tableResults);
        });
    });
}

function deletSchema(table){
    return new Promise((resolve,reject) => {
        var params = {
            TableName: table,
        };
        dynamo.deleteTable(params, function(err, data) {
            if (err) {                
                reject({[table] :err});
            }
            else {                
                resolve({[table] :data});
            }
        });
    });
}

function createDynamoDBTable(table) {
    return new Promise((resolve, reject) => {
        try {
            dynamo.createTable(tableSchemas[table], function (err, data) {
                if (err) {                
                    reject({[table] :err});
                }
                else {                
                    resolve({[table] :data});
                }
            });
        }
        catch (error) {
            reject({[table] :error});
        }
    });
}
export {createDBScehma,tables,deleteDBSchema};



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