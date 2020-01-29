const Joy = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joy.object({
        nama: Joy.string().min(6).required(),
        password: Joy.string().min(6).required(),
        phone: Joy.number().required()
    });

    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joy.object({
        phone: Joy.string().min(10).required(),
        password: Joy.string().min(6).required(),
    });

    return schema.validate(data);
}

const tsimpValidation = data => {
    const schema = Joy.object({
        idkoperasi: Joy.number().required(),
        idcabang: Joy.number().required(),
        anggotaId: Joy.number().required(),
        idjenis: Joy.number().required(),
        jk: Joy.number(),
        setoran: Joy.number(),
        nilai: Joy.number(),
        materai: Joy.number(),

    });

    return schema.validate(data);
}

const instansiValidation = data => {
    const schema = Joy.object({
        nm_instansi: Joy.string().required(),
        alamat: Joy.string().required(),
        pic: Joy.string().required(),
        phone: Joy.string().min(8),
    });

    return schema.validate(data);
}

const subinstansiValidation = data => {
    const schema = Joy.object({
        instansiId: Joy.number().required(),
        nm_sub_instansi: Joy.string().required(),
        pic: Joy.string().required(),
        phone: Joy.string().min(8),
    });

    return schema.validate(data);
}

const jabatanValidation = data => {
    const schema = Joy.object({
        nm_jabatan: Joy.string().required()
    });

    return schema.validate(data);
}

const rencanaValidation = data => {
    const schema = Joy.object({
        tanggal: Joy.date().required(),
        instansiId: Joy.number().required(),
        sub_instansiId: Joy.number().required(),
        pic: Joy.string().required(),
        keperluan: Joy.string().required(),
        statusId: Joy.number().required()
    });

    return schema.validate(data);
}

const kunjunganValidation = data => {
    const schema = Joy.object({
        tanggal: Joy.date().required(),
        instansiId: Joy.number().required(),
        sub_instansiId: Joy.number().required(),
        pic: Joy.string().required(),
        dari:  Joy.date().required(),
        sampai: Joy.date().required(),
        hasil: Joy.string().required(),
        statusId: Joy.number().required(),
        tgl_followup:Joy.date()
    });

    return schema.validate(data);
}



module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.instansiValidation = instansiValidation;
module.exports.subinstansiValidation = subinstansiValidation;
module.exports.jabatanValidation = jabatanValidation;
module.exports.rencanaValidation = rencanaValidation;
module.exports.kunjunganValidation = kunjunganValidation;
// module.exports.tsimpEditValidation = tsimpEditValidation;
// module.exports.anggotaAddValidation=anggotaAddValidation;