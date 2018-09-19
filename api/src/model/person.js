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
                if (err) ppJson(err); // an error occurred
                else ppJson(data); // successful response
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
    }

}

export default new personRepo();

