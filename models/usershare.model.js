module.exports = (sequelize, Sequelize) => {
    const userShare = sequelize.define("user_shares", {
        fileId: {
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        clientId: {
            type: Sequelize.INTEGER,
        },
        seen: {
            type: Sequelize.TINYINT,
        },
        downloaded: {
            type: Sequelize.TINYINT,
        },
        send: {
            type: Sequelize.TINYINT,
        }
    });

    return userShare;
};
