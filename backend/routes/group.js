const express = require('express');
const router = express.Router();
const groupService = require('../services/groupService');
const { verifyToken } = require('../middleware/auth');
const { groupUpdate, groupJoin } = require('../middleware/val');

router.get('/getById', async (req, res) => {
    try {
        const id = req.query.id;
        const result = await groupService.getById({ id: id });

        res.json(result);
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.get('/getByMemberCount', async (req, res) => {
    try {
        const result = await groupService.getByMemberCount();
        res.json(result);
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    try {
        const { error } = groupUpdate.validate(req.body);

        if (error) {
            throw error.details[0].message;
        }

        const result = await groupService.create({
            ...req.body,
            createdBy: req.userId
        });

        await groupService.join({
            groupId: result.id,
            userId: req.userId
        });
        
        res.json({
            message: 'Group created successfully!',
            ...result
        });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.post('/updateById', verifyToken, async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            name: req.body.name,
            intro: req.body.intro,
            avatar: req.body.avatar
        }

        const { error } = groupUpdate.validate(data);

        if (error) {
            throw error.details[0].message;
        }
        
        const result = await groupService.updateById(data);
        
        res.json({
            message: 'Group updated successfully!',
            ...result
        });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.get('/isUserIn', verifyToken, async (req, res) => {
    try {
        const id = req.query.id;
        const userId = req.query.userId;
     
        const result = await groupService.isUserIn({
            groupId: id,
            userId: userId
        });

        res.json(result);
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.post('/join', verifyToken, async (req, res) => {
    try {
        const { error } = groupJoin.validate(req.body);

        if (error) {
            throw error.details[0].message;
        }

        const result = await groupService.join({
            groupId: req.body.groupId,
            userId: req.userId
        });
        
        res.json({ message: 'Group join sucessfully!', result: result });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.delete('/exit', verifyToken, async (req, res) => {
    try {
        const { error } = groupJoin.validate(req.query);

        if (error) {
            throw error.details[0].message;
        }

        const result = await groupService.exit({
            ...req.query,
            userId: req.userId
        });
        
        res.json({ message: 'Group exit sucessfully!', result: result });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.get('/getByUserId', verifyToken, async (req, res) => {
    try {
        const result = await groupService.getByUserId({
            userId: req.userId,
        });

        res.json(result);
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

module.exports = router;