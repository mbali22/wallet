import aws from '../config/aws';


export default class transactions {
  constructor(){
      let awsResource = new aws();
  }

  GetDashBoardInfo() {
      return new Promise((resolve, reject) => {
        resolve('this is a valid transactions data');
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