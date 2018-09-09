import config from './index'
const AWS = require('aws-sdk');
import { defaultData } from "./defaultData";
import async from 'async';
import csv from 'csvtojson';
import path from 'path';

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
            { AttributeName: "Id", KeyType: "HASH"}, //Partition key 
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
    }
};

let getTransactionTypes= new Promise((resolve,reject) => {
         if(defaultData.transactionTypes){
            resolve({"transactionTypes":defaultData.transactionTypes});
         }
         else{
            reject({"transactionTypes":null});
         }
    });

let getPersons = new Promise((resolve,reject) => {
         if(defaultData.transactionTypes){
             resolve({"persons":defaultData.persons});
         }
         else{
             reject({"persons":null});
         }
    });


let getTransactions = new Promise((resolve,reject) => {
        try
        {
            let filePath = path.resolve(__dirname,'cred.csv');        
            csv({trim:true,output:'json'}).fromFile(filePath) 
                .then((jsonObj) => {
                    console.log(jsonObj);                  
                    resolve({"transactions":jsonObj});
            });
        }
        catch(err){
            resolve(err); 
        }
});

let parallel = [getTransactionTypes,getPersons,getTransactions];
let dashboardInfo = {};
function InitaliZeDbWithDefaualtData () {
        return new Promise((resolve,reject) => {            
            async.forEach(parallel,(promise) =>{                
                promise.then((data) => {                    
                    if(data.transactionTypes){
                        dashboardInfo.transactionTypes = data.transactionTypes;
                    }
                    if(data.persons){
                        dashboardInfo.persons = data.persons;
                    }                
                    if(data.transactions){
                        dashboardInfo.transactions = data.transactions;
                    }
                }).catch(err => {
                    reject(err);
                });
            });
            if(dashboardInfo){
                resolve(dashboardInfo);
            }
            else{
                reject(null);
            }
        });
}

export {InitaliZeDbWithDefaualtData};

// export default class AWSResource {  
//     constructor()  {
        
// }

 
//  createDynamoSchema() {
//         return new Promise((resolve, reject) => {                        
//             let dynamoClient = new AWS.DynamoDB({endpoint:config.aws.endpoint});
//             let params = {
//                 TableName: tables.transactions
//             };                        
//             dynamoClient.describeTable(params, function (err, data) {
//                 if (err) { 
//                     console.log(err);
//                     dynamoClient.createTable(tableSchemas.transactionsSchema, function (err, data) {
//                         if (err) {                            
//                             console.log(err);
//                             reject(err);
//                         }
//                         else {
//                             console.log('workingggg');
//                             resolve(data);
//                         }
//                     });
//                 }
//                 else {
//                     resolve(data);
//                 }
//             });
//         });
    
//     }

// }
