import express from 'express';
import person from '../controller/person';
import { resolve } from 'dns';


const router = express();
//routes for handling person related
router.get('/:personId', function (req, res) {
    person.getAllPersons(req).then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
})

router.post('/', function (req, res) {
    person.addPerson(req).then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.put('/', function (req, res) {    
    person.updatePerson(req).then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.delete('/', function (req, res) {
    person.deletePerson(req).then((responseData) => {
        res.json({ data: responseData });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});



export default router;