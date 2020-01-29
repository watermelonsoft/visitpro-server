const router = require('express').Router();
const moment = require('moment');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const { runQuery, openTable } = require('../dbOperation');
const dotenv = require('dotenv');
const randomstring = require("randomstring");

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
        if (user.length==0) return res.status(400).send('Nomor Telpon salah'); 
      
        const match = await bcrypt.compare(req.body.password, user[0].password);
       
        if (!match) return res.status(400).send('Password salah');
       
        const token_life=24;        
        const expired_at=moment().add(token_life,'hours').format('YYYY-MM-DD HH:mm:ss');
       
        
        const token =  randomstring.generate(100)
        // const salt = await bcrypt.genSalt(10);
        // const Hastoken=await bcrypt.hash(token, salt);
        
        // const d=await runQuery(`delete from auth where userId=${user[0].id}`);
        // if (d.rowsAffected==0) res.status(401).send('Acces Denied. system error');       

        const r =await runQuery(`insert into auth (userId,token,expired_at)values(${user[0].id},'${token}','${expired_at}')`);
        if(r.rowsAffected==0)res.status(401).send('Acces Denied. please try again');

        res.header('auth-token', token).send(token);
        

    } catch (err) {
        res.send(err)
    }


});


module.exports = router