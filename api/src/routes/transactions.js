import express from 'express';
import * as walletController from '../controller/transactions';


const router = express();

//routes for transactions
// router.get('/transactions', function (req, res) {
//   debugger;
//   walletController.getwalletTrans().then((responseData) => {
//     res.json( { data:responseData } );
//   }).catch(err => {
//     res.status(500).json({ error: err });
//   });
// })





export default router;
