import express from 'express';
import * as walletController from '../controller/wallet';


const router = express();

router.get('/', function (req, res) {
  debugger;
  //res.json( { data:"this is a valid Data" } );
  walletController.getwalletTrans().then((responseData) => {
    res.json( { data:responseData } );
  }).catch(err => {
    res.status(500).json({ error: err });
  });
})
export default router;
