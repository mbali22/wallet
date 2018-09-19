import express from 'express';
import person from '../controller/person';


const router = express();
//routes for handling person related
router.get('/', function (req, res) {
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

// router.put('/person', function (req, res) {
//     walletController.getwalletTrans().then((responseData) => {
//         res.json({ data: responseData });
//     }).catch(err => {
//         res.status(500).json({ error: err });
//     });
// });

// router.delete('/person', function (req, res) {
//     walletController.getwalletTrans().then((responseData) => {
//         res.json({ data: responseData });
//     }).catch(err => {
//         res.status(500).json({ error: err });
//     });
// });



export default router;