const router = require('express').Router();
const moment = require('moment');
const { registerValidation, loginValidation, userValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const { runQuery, openTable, dCount, dSum } = require('../dbOperation');
const dotenv = require('dotenv');
const randomstring = require("randomstring");
const auth = require('../auths/userAuth');

dotenv.config();

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        var tsql = "insert into Users (nama,phone,password)";
        tsql = tsql + "values('" + req.body.nama + "', '" + req.body.phone + "',  '" + hashPassword + "')";

        const result = await runQuery(tsql);
        res.send(result);
    } catch (error) {
        res.send(error);
    }



});


router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {


        const user = await openTable("select id,password from Users where phone ='" + req.body.phone + "'")
        // if (user.length == 0) return res.json({ error: true, msg: 'Nomor Telpon salah' });
        if (user.length == 0) return res.status(400).send('Nomor Telpon salah');

        const match = await bcrypt.compare(req.body.password, user[0].password);

        // if (!match) return res.json({ error: true, msg: 'Password salah' });
        if (!match) return res.status(400).send('Password salah');

        const token_life = 24;
        const expired_at = moment().add(token_life, 'hours').format('YYYY-MM-DD HH:mm:ss');


        const token = randomstring.generate(100)

        const r = await runQuery(`insert into auth (userId,token,expired_at)values(${user[0].id},'${token}','${expired_at}')`);
        if (r.rowsAffected == 0) res.status(401).send('Acces Denied. please try again');

        res.header('auth-token', token).send(token);


    } catch (err) {
        res.send(err)
    }


});

router.get('/', async (req, res) => {
    const token = req.header('auth-token');
    if (!token) return res.json({ error: true, msg: 'Acces Denied' });


    try {

        let tsql = `select * from v_auth_user where token ='${token}'`
        const r = await openTable(tsql)


        if (r.rowsAffected == 0) res.json({ error: true, msg: 'Data not found' });

        res.send(r);


    } catch (err) {
        res.json({ error: true, msg: err })
    }


});
router.get('/list', auth, async (req, res) => {
    const token = req.header('auth-token');
    if (!token) return res.json({ error: true, msg: 'Acces Denied' });


    try {

        let tsql = `select * from v_users`
        const r = await openTable(tsql)


        if (r.rowsAffected == 0) res.json({ error: true, msg: 'Data not found' });

        res.send(r);


    } catch (err) {
        res.json({ error: true, msg: err })
    }


});
router.put('/:id', auth, async (req, res) => {
    const { error } = userValidation(req.body);
    if (error) return res.json({ error: true, msg: error.details[0].message });

    try {

        let tsql = `udpate users set`
        tsql += ` nama='${req.body.nama}', `;
        tsql += ` phone='${req.body.phone}' `;
        tsql += ` status=${req.body.status} `;
        tsql += ` jabatanId='${req.body.jabatanId}' `;
        tsql += `  where id =${req.params.id} `;

        const r = await openTable(tsql)


        if (r.rowsAffected == 0) res.json({ error: true, msg: 'Data not found' });

        res.send(r);


    } catch (err) {
        res.json({ error: true, msg: err })
    }


});

router.get('/performa', auth, async (req, res) => {

    const token = req.header('auth-token');
    if (!token) return res.status(400).send('Acces Denied');


    try {

        let kunjunganini = 0
        let kunjunganlalu = 0
        let instansi = 0
        let performa = 0
        let today = new Date


        let crt = `created_by=${req.user[0].userId} and bulan=${today.getMonth() + 1} and tahun=${today.getFullYear()}`

        kunjunganini = await dSum('jml', 'v_performa', crt)
        instansi = await dCount('instansiId', 'v_performa', crt)


        let bulanLalu = new Date(today.setMonth(today.getMonth() - 1))
        crt = `created_by=${req.user[0].userId} and bulan=${bulanLalu.getMonth() + 1} and tahun=${bulanLalu.getFullYear()}`
        kunjunganlalu = await dSum('jml', 'v_performa', crt)

        if (!kunjunganini) kunjunganini = 0
        if (!kunjunganlalu) kunjunganlalu = 0
        if (!instansi) instansi = 0

        if (kunjunganlalu > 0)
            performa = (kunjunganini - kunjunganlalu) / kunjunganlalu
        else {
            performa = 100
        }


        if (kunjunganini === 0 && kunjunganlalu == 0) performa = 0
        res.json({
            kunjungan: kunjunganini,
            instansi: instansi,
            performa: performa
        });


    } catch (err) {

        res.send(err)
    }


});

module.exports = router