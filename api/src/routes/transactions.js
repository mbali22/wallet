import express from 'express';
import * as walletController from '../controller/transactions';


const router = express();

router.get('/transactions', function (req, res) {  
  walletController.getwalletTrans().then((responseData) => {
    res.json( { data:responseData } );
  }).catch(err => {
    res.status(500).json({ error: err });
  });
})





export default router;
