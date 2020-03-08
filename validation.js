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

const userValidation = data => {
    const schema = Joy.object({
        nama: Joy.string().min(3).required(),
        phone: Joy.string().min(10).required(),
        status: Joy.string().required(),
        jabatanId: Joy.number().required(),      
    });

    return schema.validate(data);
}

const instansiValidation = data => {
    const schema = Joy.object({
        provinsiId:Joy.number().required(),
        kabupatenId:Joy.number().required(),
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
        sub_instansi: Joy.string().required(),
        pic: Joy.string().required(),
        keperluan: Joy.string().required(),
        statusId: Joy.number().required()
    });

    return schema.validate(data);
}

const kunjunganValidation = data => {
    const schema = Joy.object({     
        tipe:Joy.string().required(),
        rencanaId:Joy.number().required(),
        instansiId: Joy.number().required(),
        sub_instansi: Joy.string().required(),
        pic: Joy.string().required(),
        dari:  Joy.date().required(),
        sampai: Joy.date().required(),
        hasil: Joy.string().required(),
        statusId: Joy.number().required(),
        tgl_followup:Joy.date()
    });

    return schema.validate(data);
}

const kunjunganLangsungValidation = data => {
    const schema = Joy.object({     
        tipe:Joy.string().required(),
        instansiId: Joy.number().required(),
        sub_instansi: Joy.string().required(),
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
module.exports.userValidation = userValidation;
module.exports.kunjunganLangsungValidation=kunjunganLangsungValidation;