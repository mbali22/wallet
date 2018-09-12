import {InitaliZeDbWithDefaualtData} from '../database/initializeDb';


export default class transactions { 
  constructor(){     
  } 

  GetDashBoardInfo() {
    return new Promise((resolve,reject) => {         
      InitaliZeDbWithDefaualtData().then(data => {        
          resolve(data);
      }).catch(err => { 
          reject(err);
      });
    });    
  }

  AddTransaction(transation) {
      return new Promise((resolve, reject) => {
        resolve('this is a valid transactions data');
      });
  }

  UpdateTransaction(transation) {
      return new Promise((resolve, reject) => {
        resolve('this is a valid transactions data');
      });
  }

  DeleteTransaction(transation) {
      return new Promise((resolve, reject) => {
        resolve('this is a valid transactions data');
      });
  }
  
  GetIndividualTransactions(person){

  }

}