import transactionRepo from '../model/transactions';


class transactionController {

  async getAllTransactions(req) {        
          let transactionId = req.params.personId;
          let result =  await transactionRepo.getTransactionsById(personId);
          return result;         
  }

  async addTransaction(req) {      
          let transactions = this.getTransactionFromRequestBody(req);            
          if (Array.isArray(transactions)) {   
              let result = await transactionRepo.addMultipleTransactions(transactions);
              return result;               
          }
          else if (typeof(transactions) === 'object') {  
              let result = await transactionRepo.addTransaction(transactions);
              return result;                
          }        
  }

  async updateTransaction(req) {       
          let transaction  = this.getTransactionFromRequestBody(req);            
          let result = await transactionRepo.updateTransaction(transaction);
          return result;        
  }

  async deleteTransaction(req) {       
          let deletTransaction = this.getTransactionFromRequestBody(req);
          let result = await transactionRepo.deleteTransaction(deletTransaction);      
  }    
  
  //Utility funcitons 
  getTransactionFromRequestBody(req){    
      return req.body;
  }
}


export default new transactionController();