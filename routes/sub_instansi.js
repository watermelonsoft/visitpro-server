const router = require('express').Router();
const { subinstansiValidation } = require('../validation');
const { runQuery, openTable } = require('../dbOperation');
const auth = require('../auths/userAuth');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

router.get('/', auth, async (req, res) => {
    try {
        const crt = req.query.crt;
        let tsql = `select * from sub_instansi where deleted_at is null`;
        if (crt) tsql += ' and ' + crt
        
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.get('/all', auth, async (req, res) => {
    try {
        let tsql = `select * from sub_instansi`;
        const r = await openTable(tsql);
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})

router.post('/', auth, async (req, res) => {
    const { error } = subinstansiValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let phone = "";
    let phoneLabel = ""
    if (req.body.phone) {
        phone = `'${req.body.phone}',`;
        phoneLabel = 'phone,'
    }


    try {
        let tsql = `insert into sub_instansi(instansiId,nm_sub_instansi,pic, ${phoneLabel} created_by)values(${req.body.instansiId},'${req.body.nm_sub_instansi}', '${req.body.pic}',${phone} ${req.user[0].userId})`;

        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }

})

router.put('/:id', auth, async (req, res) => {
    const { error } = subinstansiValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let phone = '';
    if (req.body.phone) phone = req.body.phone;


    try {
        let tsql = `update sub_instansi set`
        tsql += ` nm_sub_instansi='${req.body.nm_sub_instansi}', `
        tsql += ` pic='${req.body.pic}', `
        tsql += ` phone='${phone}', `,
            tsql += ` updated_by='${req.user[0].userId}' `
        tsql += `  where id =${req.params.id} `


        const r = await runQuery(tsql);
        res.send(r);
    } catch (err) {
        res.send(err);
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
             
        
        let tsql = `update sub_instansi set `
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