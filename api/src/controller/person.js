import personRepo from "../model/person";


class personController {

    async getAllPersons(req) {
        //return new Promise((resolve, reject) => {
            let personId = req.params.personId;
            let result =  await personRepo.getPersonsById(personId);
            return result;
            // personRepo.getPersonsById(personId).then(data => {
            //     resolve(data);
            // }).catch(err => {
            //     reject(err);
            // });
        //});
    }

    async addPerson(req) {
      //  return new Promise((resolve, reject) => {
            let persons = getPersonFromRequestBody(req);
            
            if (Array.isArray(persons)) {   
                let result = await personRepo.addMultiplePersons(persons);
                return result;
                // personRepo.addMultiplePersons(persons).then(data => {                    
                //     resolve(data);
                // }).catch(err => {
                //     reject(err);
                // });
            }
            else if (typeof(persons) === 'object') {  
                let result = await personRepo.addPerson(persons);
                return result;
                // personRepo.addPerson(persons).then(data => {
                //     resolve(data);
                // }).catch(err => {
                //     reject(err);
                // });
            }
        //});
    }

    updatePerson(req) {
        return new Promise((resolve, reject) => {                   
            let person  = getPersonFromRequestBody(req);            
            personRepo.updatePerson(person).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }

    deletePerson(req) {
        return new Promise((resolve, reject) => {                   
            let deletPerson = getPersonFromRequestBody(req);
            personRepo.deletePerson(deletPerson).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }

}

function getPersonFromRequestBody(req){    
    return req.body;
}
export default new personController();