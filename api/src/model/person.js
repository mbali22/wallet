import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import { parseToInt } from "../helpers/utility";


class personRepo {

    getPersonsById(personId){
       return new Promise((resolve,reject) => {
            let getParams = this.getParamsForDb(personId);
            dynamoClient.query(getParams, function(err, data) {
               if(err){
                    reject(err);
               }else{
                    resolve(data);
               }            
            });
       }); 
    }

    addPerson(person) {       
        return new Promise((resolve, reject) => {                           
            let newPerson = this.putParamsForDb(person);
            //resolve(newPerson);
            dynamoClient.put(newPerson, function(err, data) {
                if (err){
                    err.status = "failed";
                    reject(err);
                }
                else{
                    resolve({"status":"success"});
                }
            });
        });
    }







    //Util functions
    putParamsForDb(person){

        if(person.id){
            person.id = parseInt(person.id)
        }
        if(person.belongsTo){
            person.belongsTo = parseInt(person.belongsTo)
        }

        var params = {
            TableName: tables["persons"],
            Item:person,
            ConditionExpression: 'attribute_not_exists(belongsTo) AND attribute_not_exists(id)',           
            ReturnValues: 'ALL_OLD', // optional (NONE | ALL_OLD)
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
              ':value': parseInt(personId)
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

