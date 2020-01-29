const sql = require('mssql');
const dbConfig = require('./dbConfig');

const runQuery = async (queryString) => {
  
    
    try {       
        await sql.connect(dbConfig);
        const result = await sql.query(queryString);        
        return (result);

    } catch (err) {
        return err
    }
}


const openTable = async (queryString) => {
    try {
       
        await sql.connect(dbConfig)
        const result = await sql.query(queryString)
        return (result.recordset)
    } catch (err) {
        return err
    }
}

const dLookup = async (fldName, tableName, crt) => {
    let queryString = 'select ' + fldName + ' from ' + tableName;    
    if (crt) queryString += ' where ' + crt;

    try {

        await sql.connect(dbConfig);
        const result = await sql.query(queryString);
        return result.recordset[0];
    } catch (err) {
        return null
    }

}

const dSum = async (fldName, tableName, crt) => {
    let queryString = 'select sum(' + fldName + ') as jml from ' + tableName;
    if (crt) queryString += ' where ' + crt;


    try {

        await sql.connect(dbConfig);
        const result = await sql.query(queryString);
        return result.recordset[0];
    } catch (err) {
        return 0
    }

}

const dCount = async (fldName, tableName, crt) => {
    let queryString = 'select count(' + fldName + ') as jml from ' + tableName;
    if (crt) queryString += ' where ' + crt;


    try {

        await sql.connect(dbConfig);
        const result = await sql.query(queryString);
        return result.recordset[0];
    } catch (err) {
        return 0
    }
}

const dMax = async (fldName, tableName, crt) => {
    let queryString = 'select max(' + fldName + ') as jml from ' + tableName;
    if (crt) queryString += ' where ' + crt;

    try {

        await sql.connect(dbConfig);
        const result = await sql.query(queryString);
        return result.recordset[0].jml;
    } catch (err) {
        return 0
    }
}
const NZ = (value, defvalue) => {
    if (!value) return defvalue;
}

module.exports.dLookup = dLookup;
module.exports.openTable = openTable;
module.exports.dSum = dSum;
module.exports.dCount = dCount;
module.exports.runQuery = runQuery;
module.exports.dMax = dMax;
module.exports.NZ=NZ;