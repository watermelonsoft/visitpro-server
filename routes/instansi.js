const router = require('express').Router();
const { instansiValidation } = require('../validation');
const { runQuery, openTable } = require('../dbOperation');
const auth = require('../auths/userAuth');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

router.get('/', auth, async (req, res) => {
    try {
        let tsql = `select * from instansi where deleted_at is null`;
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.get('/all', auth, async (req, res) => {
    try {
        let tsql = `select * from instansi`;
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})
router.get('/:id', auth, async (req, res) => {
    try {
        let tsql = `select * from instansi where id=${req.params.id}`;
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})
router.post('/', auth, async (req, res) => {
    const { error } = instansiValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let phone = "";
    let phoneLabel=""
    if (req.body.phone){
        phone = `'${req.body.phone}',`;
        phoneLabel='phone,'
    } 


    try {
        let tsql = `insert into instansi(provinsiId,kabupatenId,nm_instansi,alamat,pic,${phoneLabel}  created_by)values(${req.body.provinsiId},${req.body.kabupatenId},'${req.body.nm_instansi}','${req.body.alamat}', '${req.body.pic}',${phone} ${req.user[0].userId})`;

       
        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }

})

router.put('/:id', auth, async (req, res) => {
    const { error } = instansiValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    // let phone = null;
    if (req.body.phone) phone = req.body.phone;


    try {
        let tsql = `update instansi set`;
        tsql += ` provinsiId=${req.body.provinsiId}, `;
        tsql += ` kabupatenId=${req.body.kabupatenId}, `;
        tsql += ` nm_instansi='${req.body.nm_instansi}', `;
        tsql += ` alamat='${req.body.alamat}', `;
        tsql += ` pic='${req.body.pic}', `;
        if (req.body.phone) tsql += ` phone='${req.body.phone}', `;
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
        let tsql = `update instansi set `
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