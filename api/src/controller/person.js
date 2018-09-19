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
            let person  = getPersonRequestFromBody(req);
            personRepo.addPerson(person).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    }


}
function getPersonRequestFromBody(req){
    return req.body;
}
export default new personController();