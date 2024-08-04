const { sql, poolPromise } = require('../config/database');

const postService = {
    getListByThreadId: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('threadId', sql.Int, data.threadId)
                .input('size', sql.Int, 50)
                .input('page', sql.Int, data.page)
                .query(`
                SELECT 
                    p.id AS id, 
                    p.content AS content, 
                    parentPost.content AS parentContent, 
                    parentUser.username AS parentUsername, 
                    p.createdAt, 
                    u.id AS userId, 
                    u.username AS createdBy, 
                    u.avatar AS avatar 
                FROM 
                    [post] p 
                INNER JOIN 
                    [user] u ON p.createdBy = u.id 
                LEFT JOIN 
                    [post] parentPost ON p.parentId = parentPost.id 
                LEFT JOIN 
                    [user] parentUser ON parentPost.createdBy = parentUser.id
                WHERE 
                    p.threadId = @threadId 
                ORDER BY 
                    p.id ASC 
                OFFSET 
                    @size * (@page - 1) ROWS 
                FETCH NEXT 
                    @size ROWS ONLY;
            `);

            return result.recordset;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    getById: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, data.id)
                .query(`
                SELECT 
                    p.id AS id, 
                    p.content AS content, 
                    parentPost.content AS parentContent, 
                    parentUser.username AS parentUsername, 
                    p.createdAt, u.id AS userId, 
                    u.username AS createdBy, 
                    u.avatar AS avatar 
                FROM 
                    [post] p 
                INNER JOIN 
                    [user] u ON p.createdBy = u.id 
                LEFT JOIN 
                    [post] parentPost ON p.parentId = parentPost.id 
                LEFT JOIN 
                    [user] parentUser ON parentPost.createdBy = parentUser.id
                WHERE 
                    p.id = @id 
                `);
console.log(result)
console.log(data)
            return result.recordset[0];
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    getCountByThreadId: async (data) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('threadId', sql.Int, data.threadId)
                .query(`SELECT COUNT(*) AS count FROM [post] p WHERE p.threadId = @threadId`);

            return result.recordset[0].count;
        }
        catch (error) {
            console.error('Error: ', error);
            throw error;
        }
    },
    create: async (data) => {
        try {
            const dateNow = new Date();

            const pool = await poolPromise;
            const result = await pool.request()
                .input('content', sql.VarChar, data.content)
                .input('threadId', sql.Int, data.threadId)
                .input('parentId', sql.Int, data.parentId)
                .input('createdBy', sql.Int, data.createdBy)
                .input('createdAt', sql.DateTime, dateNow)
                .input('updatedAt', sql.DateTime, dateNow)
                .query(`
                    INSERT INTO [post] (content, threadId, parentId, createdBy, createdAt, updatedAt)
                    OUTPUT inserted.id
                    VALUES (@content, @threadId, @parentId, @createdBy, @createdAt, @updatedAt);
                `);
            
            return result.recordset[0];
        }
        catch (error) {
            console.error('Error createPost: ', error);
            throw error;
        }
    }
}

module.exports = postService;