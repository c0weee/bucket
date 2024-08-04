const Joi = require('joi');

const userLogin = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(8).required().label("Password")
});

const userUpdate = Joi.object({
    username: Joi.string().required().label("Username"),
    avatar: Joi.string().allow(null).label("Avatar")
});

const groupUpdate = Joi.object({
    id: Joi.number().allow(null).label("Group Id"),
    name: Joi.string().required().label("Group Name"),
    intro: Joi.string().allow('', null).label("Introduction"),
    avatar: Joi.string().allow(null).label("Avatar")
});

const groupJoin = Joi.object({
    groupId: Joi.number().required("Group Id")
})

const threadUpdate = Joi.object({
    id: Joi.number().label("Id"),
    groupId: Joi.number().label("Group Id"),
    title: Joi.string().required().label("Title"),
    content: Joi.string().required().label("Content")
});

module.exports = { userLogin, userUpdate, groupUpdate, groupJoin, threadUpdate }