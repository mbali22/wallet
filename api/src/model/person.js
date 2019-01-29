import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";
import uuid from "uuid/v1";

class personRepo {

    getPersonsById(userid,LastEvaluatedKey = null){        
       return new Promise((resolve,reject) => {
           let persons = [];
            let getParams = this.getParamsForDb(userid,LastEvaluatedKey);            
            dynamoClient.query(getParams, function(err, data) {               
               if(err){
                    reject(err);
               }else{                
                if(data.LastEvaluatedKey){
                    persons.push(data);
                    getPersonsById(userid,LastEvaluatedKey);
                  }
                  else{
                    persons.push(data);
                    resolve(persons[0]);
                  }
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
            
            if(person && person.type === "admin"){
                person.userid = "222";
            }else{
                person.userid = "222";
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
            ConditionExpression: 'attribute_not_exists(userid) AND attribute_not_exists(id)',           
            ReturnValues: 'ALL_OLD', // optional (NONE | ALL_OLD)
        };
        return params;
    }

    getParamsForDb(userid){
        var params = {
            TableName: tables["persons"],
            KeyConditionExpression: '#whose = :value', 
            ExpressionAttributeNames: {
                '#whose': 'userid'
            },
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
              ':value': userid
            }
        };
        return params;
    }

    updateParamsForDb(person){        
        var params = {
            TableName:  tables["persons"],
            Key: { 
                "userid": person.userid,
                "id":person.id
            },
            UpdateExpression: 'SET fname = :fname, lname = :lname, Mobile = :Mobile',
            ConditionExpression: 'attribute_exists(userid) AND attribute_exists(id)',             
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
                "userid": deletePerson.belongsTo,
                "id":deletePerson.id
            },            
            ConditionExpression: 'attribute_exists(belongsTo) AND attribute_exists(id)',           
            ReturnValues: 'NONE',
        };
        return params;
    }
    

}

export default new personRepo();

