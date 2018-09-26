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
            "value": "transaction"
        }
    ],
    "persons":[
        {            
            "fname":"Sanjay",
            "lname":"Dc",
            "Mobile":"9741732305",
            "belongsTo":"4e2ec860-c0e6-11e8-b8ad-9f77c8081c2f"
        },
        {
          
            "fname":"Harish", 
            "lname":"Rasalkar",
            "Mobile":"9449543777",
            "belongsTo":"4e2ec860-c0e6-11e8-b8ad-9f77c8081c2f"
        },
        {
           
            "fname":"Sandeep",
            "lname":"Bhavikatti",            
            "Mobile":"919740515544",
            "belongsTo":"4e2ec860-c0e6-11e8-b8ad-9f77c8081c2f"
        },
        {
           
            "fname":"Pradeep",
            "lname":"Hotti",
            "Mobile":"9448538916",
            "belongsTo":"4e2ec860-c0e6-11e8-b8ad-9f77c8081c2f"
        },
        {
           
            "fname":"ShahiKumar",
            "lname":"MS",
            "Mobile":"9980256827",
            "belongsTo":"4e2ec860-c0e6-11e8-b8ad-9f77c8081c2f"
        },
        {
           
            "fname":"Sharanaiah",
            "lname":"Hiremath",
            "Mobile":"7406627780",
            "belongsTo":"4e2ec860-c0e6-11e8-b8ad-9f77c8081c2f"
        },
        {
           
            "fname":"Subhash",
            "lname":"Patil",
            "Mobile":"9964460038",
            "belongsTo":"4e2ec860-c0e6-11e8-b8ad-9f77c8081c2f"
        },
        {
           
            "fname":"Iliyaz",
            "lname":"a",
            "Mobile":"9620150622",
            "belongsTo":"4e2ec860-c0e6-11e8-b8ad-9f77c8081c2f"
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