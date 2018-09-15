import { defaultData } from "../database/defaultData";
import { getuniqueId } from "../helpers/utility";
import { dynamoClient } from "../config/awsResources";
import { tables } from "../database/schema";


class PersonRepo {

    getPersonsById(personId){
       return new Promise((resolve,reject) => {
            resolve('list of persons');
       });
    }

    AddPerson(person) {
        return Promise((resolve, reject) => {
            resolve('person added');
            // let retryCounter = 0;
            // if (person) {
            //     person.id = getuniqueId();
            //     let putparams = {
            //         TableName: tables.persons,
            //         Item: person
            //     };
            //     docClient.put(putparams, function (err, data) {
            //         if (err) {
            //             if (retryCounter == 2)
            //                 AddPerson(person);
            //             retryCounter++;
            //         }
            //         resolve(data);
            //     });
            // }
        });
    }

}

export default new PersonRepo();
