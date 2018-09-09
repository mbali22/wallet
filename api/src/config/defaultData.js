import csv from 'csvtojson';
import {  } from "./cred.csv";  
const defaultData = { 
    "transactionTypes":[
        {
            "id":1,
            "value":"L20"
        },
        {
            "id":2,
            "value":"LR0"
        },
        {
            "id":3,
            "value":"LT0"
        },
        {
            "id":4,
            "value":"LRP"
        },
        {
            "id":5,
            "value":"transaction"
        }
    ],
    "persons":[
        {
            "id":1,
            "fname":"Sanjay",
            "lname":"Dc",
            "Contact Number":"9741732305"
        },
        {
            "id":2,
            "fname":"Harish",
            "lname":"Rasalkar",
            "Contact Number":"9449543777"
        },
        {
            "id":3,
            "fname":"Sandeep",
            "lname":"Bhavikatti",            
            "Contact Number":"919740515544"
        },
        {
            "id":4,
            "fname":"Pradeep",
            "lname":"Hotti",
            "Contact Number":"9448538916"
        },
        {
            "id":5,
            "fname":"ShahiKumar",
            "lname":"MS",
            "Contact Number":"9980256827"
        },
        {
            "id":6,
            "fname":"Sharanaiah",
            "lname":"Hiremath",
            "Contact Number":"7406627780"
        },
        {
            "id":7,
            "fname":"Subhash",
            "lname":"Patil",
            "Contact Number":"9964460038"
        },
        {
            "id":8,
            "fname":"Iliyaz",
            "lname":"a",
            "Contact Number":"9620150622"
        }
    ],
    "transactions":[]
}

function LoadTransactionsFromCSV(){
    let csvFilePath = require('./cred.csv');
  
}


export {defaultData};