const router = require('express').Router();
const {  openTable } = require('../dbOperation');
const auth = require('../auths/userAuth');
const dotenv = require('dotenv');

dotenv.config();

router.get('/', auth, async (req, res) => {
    try {
       
        
        let tsql = `select * from s_kabupaten`;   
        
        const provinsiId = req.query.provinsiId; 
        if (provinsiId) tsql += '  where provinsiId=' + provinsiId 

        const r = await openTable(tsql);
       
        
        res.send(r);
    } catch (err) {
        res.send(err)
    }

})


module.exports = router;