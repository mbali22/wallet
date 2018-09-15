
import { defaultData } from "./defaultData";
var csv = require('csvtojson/v2');
import path from 'path';
import { CreateDBScehma } from "./schema";

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
           .then((transactions) => {                         
            //    transactions.forEach(transaction => {
            //        transaction
            //    });               
               resolve({"transactions":transactions});
       });
   }
   catch(err){
       resolve(err); 
   }
});

let parallel = [getTransactionTypes,getPersons,getTransactions];
let dashboardInfo = {};


function InitaliZeDbWithDefaualtData() {
    return new Promise((resolve, reject) => {                
        CreateDBScehma().then(data => {
            resolve(data);
            // async.forEach(parallel, (promise) => {
            //     promise.then((data) => {
            //         if (data.transactionTypes) {
            //             dashboardInfo.transactionTypes = data.transactionTypes;
            //         }
            //         if (data.persons) {
            //             dashboardInfo.persons = data.persons;
            //         }
            //         if (data.transactions) {
            //             dashboardInfo.transactions = data.transactions;
            //         }
            //     }).catch(err => {
            //         reject(err);
            //     });
            // });
            // if (dashboardInfo) {
            //     resolve(dashboardInfo);
            // }
            // else {
            //     reject(null);
            // }
        });
    });
}

export {InitaliZeDbWithDefaualtData};