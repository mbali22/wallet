import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";

const defaultData = { 
    "transactionTypes":[
        {
            "id": 1,
            "value": "L20"
        },
        {
            "id": 2,
            "value": "LR0"
        },
        {
            "id": 3,
            "value": "LT0"
        },
        {
            "id": 4,
            "value": "LRP"
        },
        {
            "id": 5,
            "value": "expense"
        }
    ],
    "persons":[
        {            
            "fname":"Sanjay",
            "lname":"Dc",
            "Mobile":"9741732305"            
        },
        {
          
            "fname":"Harish", 
            "lname":"Rasalkar",
            "Mobile":"9449543777"
        },
        {
           
            "fname":"Sandeep",
            "lname":"Bhavikatti",            
            "Mobile":"919740515544"
        },
        {
           
            "fname":"Pradeep",
            "lname":"Hotti",
            "Mobile":"9448538916"
        },
        {
           
            "fname":"ShahiKumar",
            "lname":"MS",
            "Mobile":"9980256827"
        },
        {
           
            "fname":"Sharanaiah",
            "lname":"Hiremath",
            "Mobile":"7406627780"
        },
        {
           
            "fname":"Subhash",
            "lname":"Patil",
            "Mobile":"9964460038"
        },
        {
           
            "fname":"Iliyaz",
            "lname":"a",
            "Mobile":"9620150622"
        },
        {
           
            "fname":"Mutturaj",
            "lname":"Bali",
            "Mobile":"9945322284",            
            "type":"admin"
        }
    ],
    "transactions":[]

}

function addTransactionType(transactionType) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: tables["transactionTypes"],
            Item: transactionType,
            ConditionExpression: 'attribute_not_exists(id)',
            ReturnValues: 'ALL_OLD', // optional (NONE | ALL_OLD)
        };
        dynamoClient.put(params, function (err, data) {
            if (err) {
                err.status = "failed";
                reject(err);
            }
            else {
                resolve({ "status": "success", "response": data });
            }
        });
    });
}

function addMultipleTransactionTypes() {
    return new Promise((resolve) => {        
        let promises = []; let trTypes = [];
         defaultData.transactionTypes.forEach(transactionType => {                
            promises.push(addTransactionType(transactionType).then(data => {                    
                trTypes.push(data);
            }).catch(err => {
                trTypes.push(err);
            }));
        });
        Promise.all(promises).then(() => {                
            resolve(trTypes);
        });
    });
}

export {defaultData,addMultipleTransactionTypes};