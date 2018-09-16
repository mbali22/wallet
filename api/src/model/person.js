// import { defaultData } from "../database/defaultData";
// import { getuniqueId } from "../helpers/utility";
// import { dynamoClient } from "../config/awsResources";
// import { tables } from "../database/schema";


class personRepo {

    getPersonsById(personId){
       return new Promise((resolve,reject) => {
            resolve('list of persons');
       }); 
    }

    addPerson() {       
        return new Promise((resolve, reject) => {               
            resolve('person added');
        });
    }

}

export default new personRepo();
