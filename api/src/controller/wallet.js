import * as w from '../model/transactions';

const transactions = new w();
export function getwalletTrans(){
    return new Promise((resolve,reject) => {
      transactions.GetDashBoardInfo().then(data => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
}
