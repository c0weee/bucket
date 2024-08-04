const express = require('express');
const cors = require('cors');

require('dotenv').config();

const userRouter = require('./routes/user');
const groupRouter = require('./routes/group');
const threadRouter = require('./routes/thread');
const postRouter = require('./routes/post');

const app = express();
const router = express.Router();

// middleware 
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// routes
router.use('/user', userRouter);
router.use('/group', groupRouter);
router.use('/thread', threadRouter);
router.use('/post', postRouter);

app.use('/api', router);
app.use('/', (req, res) => {
    res.send("Success!");
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})