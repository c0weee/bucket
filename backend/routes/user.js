const { createToken, verifyToken } = require('../middleware/auth');

const express = require('express');
const userService = require('../services/userService');

const { userLogin, userUpdate } = require('../middleware/val');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;

router.post('/login', async (req, res) => {
    try {
        let isNew = false;
        const data = req.body;

        const { error } = userLogin.validate(data);

        if (error) {
            throw error.details[0].message;
        }

        let user = await userService.getByEmail(data);

        if (user) {
            if (!await bcrypt.compare(data.password, user.password)) {
                throw 'Incorrect Password!';
            }
        }
        else {
            isNew = true;
            data.password = await bcrypt.hash(data.password, saltRounds);
            user = await userService.create(data);
        }

        const token = await createToken(user.id, user.username);

        return res.json({
            message: isNew ? 'Sign up successfully!' : 'Sign in successfully!',
            user: {
                id: user.id,
                username: user.username
            }, token
        });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }

});

router.get('/getById', verifyToken, async (req, res) => {
    try {

        if (req.userId != req.query.id) {
            throw "Unauthorized!";
        }

        const result = await userService.getById({
            id: req.query.id
        });

        return res.json({
            email: result.email,
            avatar: result.avatar,
            username: result.username
        });
    }
    catch (error) {
        if (error === 'Unauthorized!') {
            res.status(401).send({ errorMessage: error });
        }
        else 
        {
            res.status(500).send({ errorMessage: error.message || error });
        }
    }

});

router.post('/updateById', verifyToken, async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            avatar: req.body.avatar
        }

        const { error } = userUpdate.validate(data);

        if (error) {
            throw error.details[0].message;
        }

        const result = await userService.updateById({
            ...req.body,
            id: req.userId
        });

        return res.json({
            message: 'User updated successfully!',
            ...result
        });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

module.exports = router;