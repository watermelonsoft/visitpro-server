const router = require('express').Router();
const { kunjunganValidation } = require('../validation');
const { runQuery, openTable } = require('../dbOperation');
const auth = require('../auths/userAuth');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

router.get('/', auth, async (req, res) => {
    try {
        let tsql = `select * from v_kunjungan where deleted_at is null`;
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.get('/all', auth, async (req, res) => {
    try {
        let tsql = `select * from v_kunjungan`;
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.post('/', auth, async (req, res) => {
    const { error } = kunjunganValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let tgl_followup='';
    let tgl_followupLabel='';
    if(req.body.tgl_followup){
        tgl_followup=`'${moment(req.body.tgl_followup).format('YYYY-MM-DD HH:mm:ss')}',`;
        tgl_followupLabel='tgl_followup, ';
    }

    try {
        let tsql = `insert into kunjungan(tanggal,instansiId,sub_instansiId,pic,dari,sampai,hasil,${ tgl_followupLabel}statusId, created_by)`
        tsql += `values('${moment(req.body.tanggal).format('YYYY-MM-DD HH:mm:ss')}', ${req.body.instansiId}, ${req.body.sub_instansiId},'${req.body.pic}','${moment(req.body.dari).format('YYYY-MM-DD HH:mm:ss')}','${moment(req.body.sampai).format('YYYY-MM-DD HH:mm:ss')}','${req.body.hasil}',${tgl_followup} ${req.body.statusId},${req.user[0].userId})`;

      
        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }

})

router.put('/:id', auth, async (req, res) => {
    const { error } = kunjunganValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    try {
        let tsql = `update kunjungan set`;
        tsql += ` tanggal='${moment(req.body.tanggal).format('YYYY-MM-DD HH:mm:ss')}', `;
        tsql += ` instansiId=${req.body.instansiId}, `;
        tsql += ` sub_instansiId=${req.body.sub_instansiId}, `;
        tsql += ` pic='${req.body.pic}', `;
        sql += ` dari='${moment(req.body.dari).format('YYYY-MM-DD HH:mm:ss')}', `;
        sql += ` sampai='${moment(req.body.sampai).format('YYYY-MM-DD HH:mm:ss')}', `;
        tsql += ` hasil='${req.body.hasil}', `;
        if (req.body.tgl_followup) sql += ` tgl_followup='${moment(req.body.tgl_followup).format('YYYY-MM-DD HH:mm:ss')}', `;
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

        let tsql = `update kunjungan set `
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