const db = require("../models");
const Request = db.requests;
const User = db.users;
const Op = db.Sequelize.Op;

async function create(requestData) {
    if (!requestData.title || !requestData.type) {
        throw new Error("Title and type cannot be empty!");
    }
    return await Request.create(requestData);
}

async function findAll(title) {
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    return await Request.findAll({
        where: condition,
        include: [{
            model: User,
            as: "user",
            attributes: ['username', 'email']
        }]
    });
}

async function findAllForUser(userId) {
    return await Request.findAll({ where: { userId } });
}

async function updateStatus(id, status) {
    if (!status) throw new Error("Status cannot be empty!");
    const [num] = await Request.update({ status }, { where: { id } });
    if (num !== 1) throw new Error(`Cannot update Request with id=${id}. Maybe Request was not found!`);
    return { message: "Request status was updated successfully." };
}

module.exports = { create, findAll, findAllForUser, updateStatus }; 