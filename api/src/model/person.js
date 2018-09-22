import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";


class personRepo {

    getPersonsById(personId){
       return new Promise((resolve,reject) => {
            resolve('list of persons');
       }); 
    }

    addPerson(person) {       
        return new Promise((resolve, reject) => {               
            resolve(person);
            let newPerson = this.getPutParamsForDb(person);
            docClient.put(newPerson, function(err, data) {
                if (err){
                    reject(err);
                }
                else{
                    
                }
            });
        });
    }







    //Util functions
    getPutParamsForDb(item){
        var params = {
            TableName: tables["persons"],
            Item:item,
            ConditionExpression: 'attribute_not_exists(belongsTo) AND attribute_not_exists(id)',           
            ReturnValues: 'NONE', // optional (NONE | ALL_OLD)
        };
        return params;
    }

    getParamsForDb(personId){
        var params = {
            TableName: tables["persons"],
            KeyConditionExpression: '#whose = :value', 
            ExpressionAttributeNames: {
                '#whose': 'belongsTo'
            },
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
              ':value': personId
            }
        };
        return params;
    }

    updateParamsForDb(person){
        var params = {
            TableName:  tables["persons"],
            Key: { 
                "belongsTo": person.belongsTo,
                "id":person.id
            },
            UpdateExpression: 'SET attribute_name :value', 
            ConditionExpression: 'attribute_exists(belongsTo) AND attribute_exists(id)', 
            ExpressionAttributeNames: { 
                '#lname': 'lname'
            },
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ":lname": "chalvadi",
                "Mobile":"9741732306"
            },
            ReturnValues: 'UPDATED_NEW',
        };
    }

}

export default new personRepo();

