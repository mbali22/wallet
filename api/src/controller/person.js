import personRepo from "../model/person";


class personController {

    getAllPersons(req) {
        return new Promise((resolve, reject) => {            
            personRepo.getPersonsById().then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }

    addPerson(req) {
        return new Promise((resolve, reject) => {                    
            personRepo.addPerson().then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }


}

export default new personController();