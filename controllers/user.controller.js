const bcrypt = require("bcryptjs");
const db = require("../models");
const Client = db.client;
const File = db.file;
const userShare = db.userShare;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const nodemailer = require("nodemailer");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

exports.sendMail = () => {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "0f8f322b379e2d",
            pass: "5c3ec792b8078b"
        }
    })

    message = {
        from: "klouna@gmail.com",
        to: "martinrusev@gmail.com",
        subject: "Subject",
        text: "Hello SMTP Email"
    }
    transporter.sendMail(message, function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
}

exports.share = (req, res) => {
    console.log(req.body.email, req.body.phone, req.body.file, req.body.country_code, req.userId);
    File.findOne({
        where: {
            file_name: req.body.file
        }
    })
    .then(file => {
        Client.findOne({
            where: {
                email: req.body.email,
                country_code: req.body.country_code,
                phone: req.body.phone
            }
        })
        .then(client => {
            if(client) {
                console.log('parseInt(client.id)', parseInt(client.id));
                userShare.create({
                    userId: req.userId,
                    fileId: file.id,
                    clientId: parseInt(client.id)
                })
                .then(data => {
                    this.sendMail();
                    return res.status(200).send(true);
                });
            } else {
                Client.create({
                    email: req.body.email,
                    country_code: req.body.country_code,
                    phone: req.body.phone
                })
                .then(client => {
                    userShare.create({
                        userId: req.userId,
                        fileId: file.id,
                        clientId: client.id
                    })
                    .then(data => {
                        this.sendMail();
                        return res.status(200).send(true);
                    });
                });
            }
        });
    })
}
