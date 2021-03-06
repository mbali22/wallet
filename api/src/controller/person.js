import personRepo from "../model/person";


class personController {

    async getAllPersons(req) {        
            let userid = req.query.userid;            
            let result =  await personRepo.getPersonsById(userid);
            return result;         
    }

    async addPerson(req) {      
            let persons = this.getPersonFromRequestBody(req);            
            if (Array.isArray(persons)) {   
                let result = await personRepo.addMultiplePersons(persons);
                return result;               
            }
            else if (typeof(persons) === 'object') {  
                let result = await personRepo.addPerson(persons);
                return result;                
            }        
    }

    async updatePerson(req) {       
            let person  = this.getPersonFromRequestBody(req);            
            let result = await personRepo.updatePerson(person);
            return result;        
    }

    async deletePerson(req) {       
            let deletPerson = this.getPersonFromRequestBody(req);
            let result = await personRepo.deletePerson(deletPerson);      
    }    
    
    //Utility funcitons 
    getPersonFromRequestBody(req){    
        return req.body;
    }
}


export default new personController();