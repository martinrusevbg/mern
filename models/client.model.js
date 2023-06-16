module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("clients", {
        email: {
            type: Sequelize.STRING
        },
        country_code: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        }
    });

    return Client;
};
