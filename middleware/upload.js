const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
// const db = require("../models");
// const File = db.file;
// const Op = db.Sequelize.Op;


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/static/assets/uploads/"+req.userId);
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        console.log("req@@@@@@@@@@@@@@@ ",req.userId);
        console.log('CB!!!!!!!!!!!!!!!!!',cb);

        // File.create({
        //     file_name: file.originalname,
        //     user_id: req.userId,
        // })
        //     .then(res => {
        //         cb(null, file.originalname);
        //         console.log('res !!!!!!!!!!!!!!!!!',res);
        //     })
        //     .catch(err => {
        //
        //         console.log('err.message !!!!!!!!!!!!!!!!!',err.message);
        //     });

        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
