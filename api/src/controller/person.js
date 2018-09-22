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
            let person  = getPersonFromRequestBody(req);            
            personRepo.addPerson(person).then(data => {
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