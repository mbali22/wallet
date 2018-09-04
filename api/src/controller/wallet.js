import * as wallet from '../model/wallet';


export function getwalletTrans(){
    return new Promise((resolve,reject) => {
      wallet.getLoanTransactions().then(data => {
        resolve(data);
      }).catch((err) => {
          reject(err);
      });
    });
}
