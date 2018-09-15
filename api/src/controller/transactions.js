import w from '../model/transactions';

const transactions = new w();
export function getwalletTrans(){    
    return new Promise((resolve,reject) => {    
        debugger;         
        resolve(transactions.GetDashBoardInfo());
      }).catch((err) => {
        reject(err);
      });    
}
