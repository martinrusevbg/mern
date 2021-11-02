module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("files", {
        file_name: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.STRING
        }
    });

    return File;
};
