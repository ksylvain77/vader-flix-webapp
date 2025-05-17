const db = require("../models");
const Media = db.media;
const Op = db.Sequelize.Op;

async function create(mediaData) {
    if (!mediaData.title || !mediaData.type) {
        throw new Error("Title and type cannot be empty!");
    }
    return await Media.create(mediaData);
}

async function findAll(title) {
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    return await Media.findAll({ where: condition });
}

async function findOne(id) {
    const media = await Media.findByPk(id);
    if (!media) throw new Error(`Cannot find Media with id=${id}.`);
    return media;
}

async function update(id, mediaData) {
    const [num] = await Media.update(mediaData, { where: { id } });
    if (num !== 1) throw new Error(`Cannot update Media with id=${id}. Maybe Media was not found or req.body is empty!`);
    return { message: "Media was updated successfully." };
}

async function remove(id) {
    const num = await Media.destroy({ where: { id } });
    if (num !== 1) throw new Error(`Cannot delete Media with id=${id}. Maybe Media was not found!`);
    return { message: "Media was deleted successfully!" };
}

module.exports = { create, findAll, findOne, update, remove }; 