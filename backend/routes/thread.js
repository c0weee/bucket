const express = require('express');
const threadService = require('../services/threadService');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { threadUpdate } = require('../middleware/val');

router.get('/getByGroupId', async (req, res) => {
    try {
        const groupId = req.query.id;
        const page = req.query.page || 1;
        const search = req.query.search || '';

        const threads = await threadService.getListByGroupId({
            groupId: groupId,
            page: page,
            search: search
        });

        const count = await threadService.getCountByGroupId({
            groupId: groupId,
            search: search
        });

        res.json({
            threads,
            count
        });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.get('/getById', async (req, res) => {
    try {
        
        const id = req.query.id;
        const thread = await threadService.getById({
            id: id,
        });
        
        res.json(thread);
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.get('/getByLikes', async (req, res) => {
    try {
        const thread = await threadService.getByLikes();

        res.json(thread);
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    try {
        console.log(req.body)
        const { error } = threadUpdate.validate(req.body);

        if (error) {
            throw error.details[0].message;
        }

        const result = await threadService.create({
            ...req.body,
            createdBy: req.userId
        });

        res.json({ message: 'Thread created successfully!', result: result });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.post('/updateById', verifyToken, async (req, res) => {
    try {
        const data = {
            id: req.body.id,
            title: req.body.title,
            content: req.body.content
        };

        const { error } = threadUpdate.validate(data);

        if (error) {
            throw error.details[0].message;
        }

        const result = await threadService.updateById({
            ...req.body,
        });

        res.json({ message: 'Thread updated successfully!', result: result });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.get('/isLikeByUserId', verifyToken, async (req, res) => {
    try {
        const result = await threadService.isLikeByUserId({
            userId: req.userId,
            threadId: req.query.id
        });

        res.json(result);
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.post('/addLike', verifyToken, async (req, res) => {
    try {
        const result = await threadService.addLike({
            userId: req.userId,
            threadId: req.body.threadId
        });

        res.json({
            message: 'Like!',
            result: result
        });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.delete('/deleteLike', verifyToken, async (req, res) => {
    try {
        const result = await threadService.deleteLike({
            userId: req.userId,
            threadId: req.body.threadId
        });

        res.json({
            message: 'Remove Like!',
            result: result
        });
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.get('/getByUserId', verifyToken, async (req, res) => {
    try {
        const result = await threadService.getByUserId({
            userId: req.userId,
        });

        res.json(result);
    }
    catch (error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

module.exports = router;