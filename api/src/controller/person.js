import personRepo from "../model/person";


class personController {

    getAllPersons(req) {
        return new Promise((resolve, reject) => {
            let personId = req.params.personId;
            personRepo.getPersonsById(personId).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }

    addPerson(req) {
        return new Promise((resolve, reject) => {
            let persons = getPersonFromRequestBody(req);
            
            if (Array.isArray(persons)) {                
                personRepo.addMultiplePersons(persons).then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            }

            if (typeof(persons) === 'object') {                
                personRepo.addPerson(persons).then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            }
        });
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