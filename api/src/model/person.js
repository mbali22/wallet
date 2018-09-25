import { defaultData } from "../database/defaultData";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import { parseToInt } from "../helpers/utility";
import uuid from "uuid/v1";

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

    async addPerson(person) {   
         //return Promise.resolve(person);
        let addedperson =  await this.insertPersonToDB(person);
        return addedperson;
    }

    insertPersonToDB(person) {
        return new Promise((resolve, reject) => {
            person.id = uuid();
            
            if(person.type && person.type === "admin"){
                person.belongsTo = person.id;
            }            
            let newPerson = this.putParamsForDb(person);            
            dynamoClient.put(newPerson, function (err, data) {
                if (err) {
                    err.status = "failed";
                    reject(err);
                }
                else {
                    resolve({ "status": "success", "response":data });
                }
            });
        });
    }

    addMultiplePersons(persons) {
        return new Promise((resolve, reject) => {
            let addedPersons = []; let promises = [];
            persons.forEach(person => {                
                promises.push(this.insertPersonToDB(person).then(data => {                    
                    addedPersons.push(data);
                }).catch(err => {
                    addedPersons.push(err);
                }));
            });
            Promise.all(promises).then(() => {                
                resolve(addedPersons);
            });
        });
    }

    updatePerson(person) {       
        return new Promise((resolve, reject) => {
            //resolve(person);                           
            let updatePerson = this.updateParamsForDb(person);            
            dynamoClient.update(updatePerson, function(err, data) {
                if (err){
                    err.status = "failed";
                    reject(err);
                }
                else{
                    resolve({
                        "status":"success",
                        "updatedPeson":data
                      }
                    );
                }
            });
        });
    }

    deletePerson(person) {       
        return new Promise((resolve, reject) => {
            //resolve(person);                           
            let deletePerson = this.deleteParams(person);            
            dynamoClient.delete(deletePerson, function(err, data) {
                if (err){
                    err.status = "failed";
                    reject(err);
                }
                else{
                    resolve({
                        "status":"success",
                        "deletedPerson":data
                      }
                    );
                }
            });
        });
    }



    //Util functions
    putParamsForDb(person){      

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
            UpdateExpression: 'SET fname = :fname, lname = :lname, Mobile = :Mobile',
            ConditionExpression: 'attribute_exists(belongsTo) AND attribute_exists(id)',             
            ExpressionAttributeValues: { 
                ":lname": person.lname,
                ":fname":person.fname,
                ":Mobile":person.Mobile                
            },
            ReturnValues: 'UPDATED_NEW',
        };

        return params;
    }

    deleteParams(deletePerson){
        var params = {
            TableName:  tables["persons"],
            Key: { 
                "belongsTo": deletePerson.belongsTo,
                "id":deletePerson.id
            },            
            ConditionExpression: 'attribute_exists(belongsTo) AND attribute_exists(id)',           
            ReturnValues: 'NONE',
        };
        return params;
    }
    

}

export default new personRepo();

