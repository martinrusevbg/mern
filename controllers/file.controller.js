const uploadFile = require("../middleware/upload");
const fs = require('fs');
const db = require("../models");
const File = db.file;
const userShare = db.userShare;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        File.create({
            file_name: req.file.originalname,
            user_id: req.userId,
        })
            .then(response => {
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: `Could not upload the file. ${err}`,
                });
            });

    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file. ${err}`,
        });
    }
};

const deleted = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/"+req.userId;

    try {
        fs.unlinkSync(directoryPath+'/'+fileName);
        console.log('successfully deleted',req.userId);
        File.destroy({
            where: {
                user_id: req.userId,
                file_name: fileName
            }
        }).then(function(rowDeleted){
            if(rowDeleted === 1){
                return res.status(200).send('Successfully! File has been Deleted.');
            }
        }, function(err){
            return res.status(400).send(err);
        });
    } catch (err) {
        return res.status(400).send(err);
    }
};

const getFileInfo = (req, res) => {
    // console.log('res.id: '+req.query.id);
    userShare.findAll({
        where: {
            fileId: req.query.id,
            userId: req.userId
        }
    })
    .then(fileShare => {
        res.status(200).send(fileShare);
    });
};

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/"+req.userId;
    if (!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath);
    }

    File.findAndCountAll({
        limit: Number(req.query.perpage),
        offset: (Number(req.query.page) - 1)*(Number(req.query.perpage)),
        where: {
            user_id: req.userId,
            file_name: { [Op.like]: `%${req.query.search}%` }
        }
    }).then(function(filesInDBRows) {

        fs.readdir(directoryPath, function (err, files) {
            if (err) {
                res.status(500).send({
                    message: "Unable to scan files!",
                });
            }

            let fileInfos = [];
            let filesInDB = filesInDBRows.rows;
            let filesShare = [];
            files.forEach((file) => {
                for (let i = filesInDB.length -1; i >= 0 ; i--) {
                    if (filesInDB[i].file_name === file) {
                        // userShare.findAll({
                        //     where: {
                        //         fileId: filesInDB[i].id,
                        //         userId: req.userId
                        //     }
                        // })
                        // .then(fileShare => {
                        //     filesShare.push(fileShare);
                        // });

                        fileInfos.push({
                            name: file,
                            id: filesInDB[i].id,
                            url: directoryPath + file,
                            createdAt: filesInDB[i].createdAt,
                            // fileShare: filesShare
                        });
                        filesInDB.splice(i, 1);
                    }
                }
            });
            let data = {
                files: fileInfos,
                total: filesInDBRows.count
            }
            res.status(200).send(data);
        });
    })
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/"+req.userId+"/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    getListFiles,
    getFileInfo,
    download,
    deleted
};
