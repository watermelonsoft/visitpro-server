const sql=require('mssql');
const {openTable}=require('../dbOperation');

module.exports = async function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Acces Denied');

    try {
        const user = await verify(token);       
        if (!user) return res.status(401).send('Acces Denied 2');
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

const verify= async(token)=>{
    try {
       
        const r= await openTable(`select userId from v_auth where token='${token}'  `);
       
        if (r.length>0) return(r);
        else return null;
        
    } catch (err) {
        return null;
    }
    
}