const express = require('express');
const postService = require('../services/postService');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get('/getByThreadId', async (req, res) => {
    try
    {
        const threadId = req.query.id;
        const page = req.query.page || 1;

        const posts = await postService.getListByThreadId({
            threadId: threadId,
            page: page
        });
        
        const count = await postService.getCountByThreadId({
            threadId: threadId
        });

        res.json({
            posts: posts, 
            count: count
        });
    }
    catch(error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    try
    {
        const data = req.body;
        const insert = await postService.create({
            ...data,
            createdBy: req.userId
        });

        const result = await postService.getById({
            id: insert.id
        })
        
        res.json(result);
    }
    catch(error) {
        res.status(500).send({ errorMessage: error.message || error });
    }
});

module.exports = router;