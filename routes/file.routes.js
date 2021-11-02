const { authJwt } = require("../middleware");
const controller = require("../controllers/file.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/upload",[authJwt.verifyToken], controller.upload);
    app.get("/api/files",[authJwt.verifyToken], controller.getListFiles);
    app.get("/api/file/:name",[authJwt.verifyToken], controller.download);
    app.delete("/api/file/:name",[authJwt.verifyToken], controller.deleted);
};
