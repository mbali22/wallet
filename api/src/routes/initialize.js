import express from 'express';
import { createDBScehma } from "../database/schema";


const router = express();

router.get('/schema', function (req, res) {
    createDBScehma().then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
})

export default router;

