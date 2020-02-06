const router = require('express').Router();
const { jabatanValidation } = require('../validation');
const { runQuery, openTable } = require('../dbOperation');
const auth = require('../auths/userAuth');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

router.get('/', auth, async (req, res) => {
    try {
        let tsql = `select * from jabatan where deleted_at is null`;     
        const r = await openTable(tsql);
       
        
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.get('/all', auth, async (req, res) => {
    try {
        let tsql = `select * from jabatan`;
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.post('/', auth, async (req, res) => {
    const { error } = jabatanValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    try {
        let tsql = `insert into jabatan(nm_jabatan, created_by)values('${req.body.nm_jabatan}',${req.user[0].userId} )`;
        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }

})

router.put('/:id', auth, async (req, res) => {
    const { error } = jabatanValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    try {
        let tsql = `update jabatan set`;
        tsql += ` nm_jabatan='${req.body.nm_jabatan}', `;
        tsql += ` updated_by='${req.user[0].userId}' `;
        tsql += `  where id =${req.params.id} `;


        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {

        let tsql = `update jabatan set `
        tsql += ` deleted_by='${req.user[0].userId}', `;
        tsql += `deleted_at='${moment().format('YYYY-MM-DD HH:mm:ss')}' `
        tsql += ` where id =${req.params.id}`;

        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }
})

module.exports = router;