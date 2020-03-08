const router = require('express').Router();
const { kunjunganValidation, kunjunganLangsungValidation } = require('../validation');
const { runQuery, openTable } = require('../dbOperation');
const auth = require('../auths/userAuth');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

router.get('/', auth, async (req, res) => {
    try {
        const crt = req.query.crt;
        let tsql = `select * from v_kunjungan where deleted_at is null`;
        if (crt) tsql += ' and ' + crt

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
 
    let validationResult
    if (req.body.rencanaId) {
        validationResult = kunjunganValidation(req.body);
    } else {
        validationResult = kunjunganLangsungValidation(req.body);
    }
    
    if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message);




    let tgl_followup = '';
    let tgl_followupLabel = '';
    if (req.body.tgl_followup) {
        tgl_followup = `'${moment(req.body.tgl_followup).format('YYYY-MM-DD HH:mm:ss')}',`;
        tgl_followupLabel = 'tgl_followup, ';
    }

    let rencanaId = '';
    let rencanaIdLabel = '';
    if (req.body.rencanaId) {
        rencanaId = `'${req.body.rencanaId}',`;
        rencanaIdLabel = 'rencanaId, ';
    }

    try {
        let tsql = `insert into kunjungan(tipe,${rencanaIdLabel} instansiId,sub_instansi,pic,dari,sampai,hasil,${tgl_followupLabel}statusId, created_by)`
        tsql += `values('${req.body.tipe}', ${rencanaId}   ${req.body.instansiId}, '${req.body.sub_instansi}','${req.body.pic}','${moment(req.body.dari).format('YYYY-MM-DD HH:mm:ss')}','${moment(req.body.sampai).format('YYYY-MM-DD HH:mm:ss')}','${req.body.hasil}',${tgl_followup} ${req.body.statusId},${req.user[0].userId})`;



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
        tsql += ` tipe='${req.body.tipe}', `;
        tsql += ` instansiId=${req.body.instansiId}, `;
        tsql += ` sub_instansi='${req.body.sub_instansi}', `;
        tsql += ` pic='${req.body.pic}', `;
        tsql += ` dari='${moment(req.body.dari).format('YYYY-MM-DD HH:mm:ss')}', `;
        tsql += ` sampai='${moment(req.body.sampai).format('YYYY-MM-DD HH:mm:ss')}', `;
        tsql += ` hasil='${req.body.hasil}', `;
        if (req.body.tgl_followup) tsql += ` tgl_followup='${moment(req.body.tgl_followup).format('YYYY-MM-DD HH:mm:ss')}', `;
        tsql += ` statusId='${req.body.statusId}', `;
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