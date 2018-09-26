import express from 'express';
import { createDBScehma } from "../database/schema";
import { addMultipleTransactionTypes } from "../database/defaultData";


const router = express();

router.get('/schema', function (req, res) {
    createDBScehma().then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.get('/data', function (req, res) {
    addMultipleTransactionTypes().then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

export default router;

