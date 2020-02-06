const router = require('express').Router();
const { rencanaValidation } = require('../validation');
const { runQuery, openTable } = require('../dbOperation');
const auth = require('../auths/userAuth');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

router.get('/', auth, async (req, res) => {
    try {

        const crt = req.query.crt;
        let tsql = `select * from v_rencana where deleted_at is null`;
        if (crt) tsql += ' and ' + crt
        
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.get('/all', auth, async (req, res) => {
    try {
        let tsql = `select * from v_rencana`;
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.post('/', auth, async (req, res) => {
    const { error } = rencanaValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    try {
        let tsql = `insert into rencana(tanggal,instansiId,sub_instansiId,pic,keperluan,statusId, created_by)`
        tsql += `values('${moment(req.body.tanggal).format('YYYY-MM-DD HH:mm:ss')}', ${req.body.instansiId}, ${req.body.sub_instansiId},'${req.body.pic}','${req.body.keperluan}', ${req.body.statusId},${req.user[0].userId})`;
        
        // return res.send(tsql)
        
        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }

})

router.put('/:id', auth, async (req, res) => {
    const { error } = rencanaValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    
    try {
        let tsql = `update rencana set`;
        tsql += ` tanggal='${moment(req.body.tanggal).format('YYYY-MM-DD HH:mm:ss')}', `;
        tsql += ` instansiId=${req.body.instansiId}, `;
        tsql += ` sub_instansiId=${req.body.sub_instansiId}, `;
        tsql += ` pic='${req.body.pic}', `;
        tsql += ` keperluan='${req.body.keperluan}', `;
        tsql += ` statusId='${req.body.statusId}', `;
        tsql += ` updated_by='${req.user[0].userId}' `;
        tsql += `  where id =${req.params.id} `;

        // return res.send(tsql)
        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {

        let tsql = `update rencana set `
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