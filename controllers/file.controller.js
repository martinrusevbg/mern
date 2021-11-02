const uploadFile = require("../middleware/upload");
const fs = require('fs');
const db = require("../models");
const File = db.file;

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

        // res.status(200).send({
        //     message: "Uploaded the file successfully: " + req.file.originalname,
        // });
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
        }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
            if(rowDeleted === 1){
                return res.status(200).send('Successfully! File has been Deleted.');
            }
        }, function(err){
            return res.status(400).send(err);
        });
        // return res.status(200).send('Successfully! File has been Deleted.');
    } catch (err) {
        return res.status(400).send(err);
    }
};

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/"+req.userId;
    if (!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath);
    }

    let filesInDB = [];
    File.findAll({
        where: {
            user_id: req.userId
        }
    }).then(function(filesInDB) {
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%% ",filesInDB);
        fs.readdir(directoryPath, function (err, files) {
            if (err) {
                res.status(500).send({
                    message: "Unable to scan files!",
                });
            }

            let fileInfos = [];

            files.forEach((file) => {
                console.log('req.userId',req.userId);
                console.log('file_name',file);
                for (let i = filesInDB.length -1; i >= 0 ; i--) {
                    if (filesInDB[i].file_name === file) {
                        fileInfos.push({
                            name: file,
                            url: directoryPath + file,
                        });
                        filesInDB.splice(i, 1);
                    }
                }
            });
            console.log('fileInfos',fileInfos);
            res.status(200).send(fileInfos);
            // res.status(200).send(fileInfos);
        });
    })

    // console.log('^^^^^^^^^^^^^^',filesInDB);
    // fs.readdir(directoryPath, function (err, files) {
    //     if (err) {
    //         res.status(500).send({
    //             message: "Unable to scan files!",
    //         });
    //     }
    //
    //     let fileInfos = [];
    //
    //     files.forEach((file) => {
    //         console.log('req.userId',req.userId);
    //         console.log('file_name',file);
    //         File.findOne({
    //             where: {
    //                 user_id: req.userId,
    //                 file_name: file
    //             }
    //         }).then(function(file) {
    //             console.log("%%%%%%%%%%%%%%%%%%%%%%%%% ",file);
    //             fileInfos.push({
    //                 name: file.file_name,
    //                 url: directoryPath + file.file_name,
    //             });
    //
    //         })
    //
    //
    //
    //         // fileInfos.push({
    //         //     name: file,
    //         //     url: directoryPath + file,
    //         // });
    //     });
    //     console.log('fileInfos',fileInfos);
    //     res.status(200).send(fileInfos);
    //     // res.status(200).send(fileInfos);
    // });
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
    download,
    deleted
};
