const express = require('express');
const app = express();
const cors= require('cors');
const userRoute = require('./routes/user');
const instasiRoute = require('./routes/instansi');
const subinstasiRoute = require('./routes/sub_instansi');
const jabatanRoute = require('./routes/jabatan');
const rencanaRoute = require('./routes/rencana');
const kunjunganRoute = require('./routes/kunjungan');
const provinsiRoute = require('./routes/provinsi');
const kabupatenRoute = require('./routes/kabupaten');

//middleware
app.use(cors());
app.use(express.json()); // untuk parsing body request menjadi json
app.use('/api/user', userRoute);
app.use('/api/instansi', instasiRoute);
app.use('/api/subinstansi', subinstasiRoute);
app.use('/api/jabatan', jabatanRoute);
app.use('/api/rencana', rencanaRoute);
app.use('/api/kunjungan', kunjunganRoute);
app.use('/api/provinsi', provinsiRoute);
app.use('/api/kabupaten', kabupatenRoute);

app.listen(3000, () => console.log('Server Up and Running'))