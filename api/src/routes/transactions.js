import express from 'express';
import transaction from '../controller/transactions';

const router = express();
//routes for handling person related
router.get('/:personId', function (req, res) {
    transaction.getAllTransactions(req).then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
})

router.post('/', function (req, res) {    
    transaction.addTransaction(req).then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.put('/', function (req, res) {    
    transaction.updateTransaction(req).then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.delete('/', function (req, res) {
    transaction.deleteTransaction(req).then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});



export default router;